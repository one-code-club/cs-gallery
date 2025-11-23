'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const COOKIE_NAME = 'gallery_session'

async function getClientIp() {
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp
  
  // Fallback for local development
  return '127.0.0.1'
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  if (!session) return null
  try {
    return JSON.parse(session.value) as { ip: string; role: Role; nickname: string }
  } catch {
    return null
  }
}

export async function login(formData: FormData) {
  const nicknameInput = formData.get('nickname') as string
  if (!nicknameInput || nicknameInput.trim() === '') {
    return { error: 'Nickname is required' }
  }

  const ip = await getClientIp()
  let role: Role = 'STUDENT'
  let cleanNickname = nicknameInput.trim()

  const adminCode = process.env.ADMIN_CODE
  
  // Check suffixes
  if (cleanNickname.endsWith('?TA')) {
    role = 'TA'
    cleanNickname = cleanNickname.replace(/\?TA$/, '')
  } else if (adminCode && cleanNickname.endsWith(`?${adminCode}`)) {
    role = 'ADMIN'
    cleanNickname = cleanNickname.replace(new RegExp(`\\?${adminCode}$`), '')
  }
  
  // Handle generic ? suffix removal if any remained (requirement says "replace any characters after '?' inclusive")
  // Actually, the login logic specified specific suffixes for roles. 
  // But header requirement says "replace any characters after '?' inclusive".
  // I will store the CLEANED nickname for display.
  // If user enters "Tom?XYZ", and it doesn't match TA or Admin, is it Student "Tom"? 
  // The requirement says "Otherwise... STUDENT". 
  // It doesn't explicitly say strip random suffixes for students, but Header req implies it.
  // I will strip everything after '?' for the storage to be safe and consistent.
  if (cleanNickname.includes('?')) {
    cleanNickname = cleanNickname.split('?')[0]
  }

  if (!cleanNickname) {
      return { error: 'Invalid nickname' }
  }

  try {
    await prisma.user.upsert({
      where: { ipAddress: ip },
      update: {
        nickname: cleanNickname,
        role: role,
        lastLoginAt: new Date(),
      },
      create: {
        ipAddress: ip,
        nickname: cleanNickname,
        role: role,
        lastLoginAt: new Date(),
      },
    })
  } catch (e) {
    console.error('Login error', e)
    return { error: 'Database error during login' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, JSON.stringify({ ip, role, nickname: cleanNickname }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  if (role === 'ADMIN') redirect('/admin')
  if (role === 'TA') redirect('/voting')
  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/login')
}

export async function submitUrl(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'STUDENT') {
    return { error: 'Unauthorized' }
  }

  const url = formData.get('url') as string
  if (!url) return { error: 'URL is required' }

  const requiredText = process.env.REQUIRED_TEXT
  if (requiredText && !url.includes(requiredText)) {
    return { error: `URL must contain "${requiredText}"` }
  }

  try {
    await prisma.submission.upsert({
      where: { userId: session.ip },
      update: { url: url, updatedAt: new Date() },
      create: {
        url: url,
        userId: session.ip,
      },
    })
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to submit' }
  }
}

export async function getSubmissionsForTA() {
  const session = await getSession()
  if (!session || session.role !== 'TA') return []

  // Get all submissions and include votes
  // We need to know if CURRENT TA voted.
  const submissions = await prisma.submission.findMany({
    include: {
      user: {
        select: { nickname: true }
      },
      votes: true 
    },
    orderBy: {
      user: {
        nickname: 'asc'
      }
    }
  })

  return submissions.map(sub => ({
    ...sub,
    voteCount: sub.votes.length,
    votedByMe: sub.votes.some(v => v.voterIp === session.ip)
  }))
}

export async function saveVotes(submissionIds: number[]) {
  const session = await getSession()
  if (!session || session.role !== 'TA') return { error: 'Unauthorized' }

  if (submissionIds.length > 5) return { error: 'Max 5 votes allowed' }

  try {
    // Transaction: Delete all previous votes by this TA, then add new ones
    await prisma.$transaction(async (tx) => {
      // 1. Remove all votes by this TA
      await tx.vote.deleteMany({
        where: { voterIp: session.ip }
      })

      // 2. Add new votes
      if (submissionIds.length > 0) {
        await tx.vote.createMany({
          data: submissionIds.map(id => ({
            submissionId: id,
            voterIp: session.ip
          }))
        })
      }
    })
    
    revalidatePath('/voting')
    revalidatePath('/gallery') // Update gallery too
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to save votes' }
  }
}

export async function getAdminData() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { users: [] }

  const users = await prisma.user.findMany({
    include: {
      submission: true
    },
    orderBy: [
      { role: 'asc' },
      { nickname: 'asc' }
    ]
  })

  return { users }
}

export async function resetVotes() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    await prisma.vote.deleteMany({})
    revalidatePath('/voting')
    revalidatePath('/gallery')
    return { success: true }
  } catch (e) {
    return { error: 'Failed to reset votes' }
  }
}

export async function clearAllSubmissions() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    // Due to cascade delete on Vote model, this will also delete all votes associated with submissions
    await prisma.submission.deleteMany({})
    revalidatePath('/voting')
    revalidatePath('/gallery')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to clear all submissions' }
  }
}

export async function getGalleryData() {
  // Public or Authenticated
  const submissions = await prisma.submission.findMany({
    include: {
      user: { select: { nickname: true } },
      votes: true
    }
  })

  const data = submissions.map(s => ({
    id: s.id,
    nickname: s.user.nickname,
    url: s.url,
    voteCount: s.votes.length
  }))

  // Sort by votes desc? Requirement says "sorted by Nickname" for TA, but Gallery? 
  // "Show all submitted URLs in cards... Contains... The number of votes".
  // Usually gallery is sorted by votes or shuffle. 
  // No specific sort order in reqs for Gallery. "Admin... Users sorted by...".
  // TA "Card items are sorted by Nickname".
  // I will sort by Nickname for consistency, or Votes. I'll stick to Nickname unless asked.
  return data.sort((a, b) => a.nickname.localeCompare(b.nickname))
}

