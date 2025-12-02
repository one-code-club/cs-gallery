'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'

const COOKIE_NAME = 'gallery_session'
type Role = 'STUDENT' | 'TA' | 'ADMIN'

// Error response type for i18n support
type ErrorResponse = {
  error: string
  errorKey?: string
  errorParams?: Record<string, string | number>
}

type SuccessResponse = {
  success: true
}

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
    return JSON.parse(session.value) as { deviceId: string; role: Role; nickname: string }
  } catch {
    return null
  }
}

export async function login(formData: FormData): Promise<ErrorResponse | void> {
  const nicknameInput = formData.get('nickname') as string
  const deviceId = formData.get('deviceId') as string
  
  if (!nicknameInput || nicknameInput.trim() === '') {
    return { error: 'Nickname is required', errorKey: 'nicknameRequired' }
  }

  if (!deviceId || deviceId.trim() === '') {
    return { error: 'Device ID is required', errorKey: 'deviceIdRequired' }
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
      return { error: 'Invalid nickname', errorKey: 'invalidNickname' }
  }

  try {
    await prisma.user.upsert({
      where: { deviceId: deviceId },
      update: {
        nickname: cleanNickname,
        role: role,
        ipAddress: ip,
        lastLoginAt: new Date(),
      },
      create: {
        deviceId: deviceId,
        nickname: cleanNickname,
        role: role,
        ipAddress: ip,
        lastLoginAt: new Date(),
      },
    })
  } catch (e) {
    console.error('Login error', e)
    return { error: 'Database error during login', errorKey: 'databaseError' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, JSON.stringify({ deviceId, role, nickname: cleanNickname }), {
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

export async function submitUrl(formData: FormData): Promise<ErrorResponse | SuccessResponse> {
  const session = await getSession()
  if (!session || session.role !== 'STUDENT') {
    return { error: 'Unauthorized', errorKey: 'unauthorized' }
  }

  const url = formData.get('url') as string
  if (!url) return { error: 'URL is required', errorKey: 'urlRequired' }

  const location = formData.get('location') as string
  if (!location) return { error: 'Location is required', errorKey: 'locationRequired' }

  const validLocations = ['Zoom Online', 'Kawasaki', 'Kumamoto', 'Kobe', 'Noto', 'Hakui']
  if (!validLocations.includes(location)) {
    return { error: 'Invalid location', errorKey: 'invalidLocation' }
  }

  const requiredText = process.env.REQUIRED_TEXT
  if (requiredText && !url.includes(requiredText)) {
    return { 
      error: `URL must contain "${requiredText}"`, 
      errorKey: 'urlMustContain',
      errorParams: { text: requiredText }
    }
  }

  try {
    await prisma.submission.upsert({
      where: { userId: session.deviceId },
      update: { url: url, location: location, updatedAt: new Date() },
      create: {
        url: url,
        location: location,
        userId: session.deviceId,
      },
    })
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to submit', errorKey: 'failedToSubmit' }
  }
}

type SubmissionWithVotes = {
  id: number
  url: string
  user: { nickname: string }
  votes: { voterId: string }[]
}

export async function getSubmissionsForTA() {
  const session = await getSession()
  if (!session || session.role !== 'TA') return []

  // Get all submissions and include votes
  // We need to know if CURRENT TA voted.
  const submissions: SubmissionWithVotes[] = await prisma.submission.findMany({
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
    votedByMe: sub.votes.some(v => v.voterId === session.deviceId)
  }))
}

export async function saveVotes(submissionIds: number[]): Promise<ErrorResponse | SuccessResponse> {
  const session = await getSession()
  if (!session || session.role !== 'TA') return { error: 'Unauthorized', errorKey: 'unauthorized' }

  const maxVotes = parseInt(process.env.VOTE_MAX || '5', 10)
  if (submissionIds.length > maxVotes) {
    return { 
      error: `Max ${maxVotes} votes allowed`, 
      errorKey: 'maxVotesAllowed',
      errorParams: { max: maxVotes }
    }
  }

  try {
    // Transaction: Delete all previous votes by this TA, then add new ones
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Remove all votes by this TA
      await tx.vote.deleteMany({
        where: { voterId: session.deviceId }
      })

      // 2. Add new votes
      if (submissionIds.length > 0) {
        await tx.vote.createMany({
          data: submissionIds.map(id => ({
            submissionId: id,
            voterId: session.deviceId
          }))
        })
      }
    })
    
    revalidatePath('/voting')
    revalidatePath('/gallery') // Update gallery too
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to save votes', errorKey: 'failedToSaveVotes' }
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

export async function resetVotes(): Promise<ErrorResponse | SuccessResponse> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized', errorKey: 'unauthorized' }

  try {
    await prisma.vote.deleteMany({})
    revalidatePath('/voting')
    revalidatePath('/gallery')
    return { success: true }
  } catch (e) {
    return { error: 'Failed to reset votes', errorKey: 'failedToResetVotes' }
  }
}

export async function clearAllSubmissions(): Promise<ErrorResponse | SuccessResponse> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized', errorKey: 'unauthorized' }

  try {
    // Due to cascade delete on Vote model, this will also delete all votes associated with submissions
    await prisma.submission.deleteMany({})
    revalidatePath('/voting')
    revalidatePath('/gallery')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to clear all submissions', errorKey: 'failedToClearSubmissions' }
  }
}

export async function clearAllUsers(): Promise<ErrorResponse | SuccessResponse> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized', errorKey: 'unauthorized' }

  try {
    // Clean up everything
    await prisma.$transaction([
      prisma.vote.deleteMany({}),
      prisma.submission.deleteMany({}),
      prisma.user.deleteMany({})
    ])
    
    revalidatePath('/voting')
    revalidatePath('/gallery')
    revalidatePath('/admin')
    // Since users are deleted, the current session user is also gone from DB.
    // But the cookie remains until logout. 
    // However, any subsequent request checking DB for user validity might fail 
    // if we added such checks. Currently getSession only decodes cookie.
    // But logging out might be appropriate or at least refreshing.
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to clear all users', errorKey: 'failedToClearUsers' }
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
    location: s.location,
    voteCount: s.votes.length
  }))

  // Sort by votes descending, then nickname ascending
  return data.sort((a, b) => {
    if (b.voteCount !== a.voteCount) {
      return b.voteCount - a.voteCount
    }
    return a.nickname.localeCompare(b.nickname)
  })
}
