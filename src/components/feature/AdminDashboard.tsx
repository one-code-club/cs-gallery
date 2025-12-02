'use client'

import { useRouter } from 'next/navigation'
import { resetVotes, clearAllSubmissions, clearAllUsers } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useLanguage } from '@/components/language-provider'

interface User {
    ipAddress: string
    nickname: string
    role: string
    submission: any
}

export function AdminDashboard({ initialUsers }: { initialUsers: User[] }) {
    const router = useRouter()
    const { t } = useLanguage()

    const handleReset = async () => {
        const res = await resetVotes()
        if (res.success) {
            alert(t.admin.votesResetSuccess)
            router.refresh()
        } else {
            alert(t.admin.votesResetError)
        }
    }

    const handleClearSubmissions = async () => {
        const res = await clearAllSubmissions()
        if (res.success) {
            alert(t.admin.submissionsClearedSuccess)
            router.refresh()
        } else {
            alert(t.admin.submissionsClearedError)
        }
    }

    const handleClearUsers = async () => {
        const res = await clearAllUsers()
        if (res.success) {
            alert(t.admin.usersClearedSuccess)
            router.refresh()
        } else {
            alert(t.admin.usersClearedError)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{t.admin.title}</h1>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">{t.admin.clearAllUsers}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.admin.confirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t.admin.confirmClearUsers}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.admin.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearUsers}>{t.admin.continue}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">{t.admin.clearAllSubmissions}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.admin.confirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t.admin.confirmClearSubmissions}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.admin.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearSubmissions}>{t.admin.continue}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">{t.admin.resetAllVotes}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.admin.confirmTitle}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t.admin.confirmResetVotes}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.admin.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset}>{t.admin.continue}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.admin.tableRole}</TableHead>
                            <TableHead>{t.admin.tableNickname}</TableHead>
                            <TableHead>{t.admin.tableIpAddress}</TableHead>
                            <TableHead>{t.admin.tableSubmitted}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialUsers.map((user) => (
                            <TableRow key={user.ipAddress}>
                                <TableCell className="font-medium">{user.role}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{user.ipAddress}</TableCell>
                                <TableCell>{user.submission ? t.admin.yes : t.admin.no}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
