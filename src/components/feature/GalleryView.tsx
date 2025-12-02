'use client'

import { useState, useEffect } from 'react'
import { getGalleryData } from '@/lib/actions'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart } from 'lucide-react'

interface GalleryItem {
  id: number
  nickname: string
  url: string
  location: string
  voteCount: number
}

export function GalleryView({ initialData }: { initialData: GalleryItem[] }) {
    const [items, setItems] = useState(initialData)

    useEffect(() => {
        const interval = setInterval(async () => {
            const data = await getGalleryData()
            setItems(data)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardContent className="pt-6 flex-grow">
                            <h3 className="font-bold text-lg mb-1">{item.nickname}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline break-all text-sm"
                            >
                                {item.url}
                            </a>
                        </CardContent>
                        <CardFooter className="bg-muted/30 p-4 flex items-center gap-2 border-t">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            <span className="font-bold">{item.voteCount}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

