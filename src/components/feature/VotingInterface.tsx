'use client'

import { useState, useEffect } from 'react'
import { getSubmissionsForTA, saveVotes } from '@/lib/actions'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Submission {
  id: number
  url: string
  user: { nickname: string }
  voteCount: number
  votedByMe: boolean
}

export function VotingInterface({ initialData, maxVotes }: { initialData: Submission[], maxVotes: number }) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialData)
  
  // Initialize selectedIds based on what the server says "I voted for"
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => 
    new Set(initialData.filter(s => s.votedByMe).map(s => s.id))
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getSubmissionsForTA()
      setSubmissions(data)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleVote = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      if (newSelected.size >= maxVotes) {
        alert(`You can only vote for up to ${maxVotes} submissions.`)
        return
      }
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveVotes(Array.from(selectedIds))
    if (result.error) {
      alert(result.error)
    } else {
        const data = await getSubmissionsForTA()
        setSubmissions(data)
    }
    setIsSaving(false)
  }

  const getDisplayCount = (sub: Submission) => {
    const serverVoted = sub.votedByMe
    const localVoted = selectedIds.has(sub.id)
    
    let count = sub.voteCount
    if (serverVoted && !localVoted) count--
    if (!serverVoted && localVoted) count++
    
    return count
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-4 z-10 bg-background/80 backdrop-blur-md p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold">Voting Page</h2>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
                Votes: {selectedIds.size} / {maxVotes}
            </span>
            <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Submit Votes'}
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        {submissions.map(sub => {
            const isSelected = selectedIds.has(sub.id)
            return (
                <Card key={sub.id} className="flex flex-col">
                    <CardContent className="pt-6 flex-grow">
                        <h3 className="font-bold text-lg mb-1">{sub.user.nickname}</h3>
                        <a 
                            href={sub.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all text-sm"
                        >
                            {sub.url}
                        </a>
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-4 flex justify-between items-center border-t">
                        <span className="font-bold">
                            {getDisplayCount(sub)} <span className="text-xs font-normal text-muted-foreground">votes</span>
                        </span>
                        <button 
                            onClick={() => toggleVote(sub.id)}
                            className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                        >
                            <Heart 
                                className={cn(
                                    "w-7 h-7 transition-all",
                                    isSelected ? "fill-red-500 text-red-500 drop-shadow-sm" : "text-muted-foreground/50 hover:text-red-400"
                                )}
                            />
                        </button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  )
}

