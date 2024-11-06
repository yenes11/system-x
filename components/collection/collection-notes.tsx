'use client';

import { CollectionNote } from '@/lib/types';
import { Card, CardContent, CardFooter } from '../ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Icon from '../ui/icon';
import moment from 'moment';
import api from '@/api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast';
import { useTranslations } from 'use-intl';
import { useState } from 'react';

interface Props {
  notes: CollectionNote[];
}

function CollectionNotes({ notes }: Props) {
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(['user-info']) as any;
  const router = useRouter();
  const t = useTranslations();
  const params = useParams();
  console.log(params, 'params');
  const [input, setInput] = useState('');

  const addNote = useMutation({
    mutationFn: async (values: any) => {
      const res = await api.post('/CollectionNotes', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      toast({
        title: t('success'),
        description: t('note_added')
      });
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: t('unknown_error'),
        variant: 'destructive'
      });
    }
  });

  return (
    <Card>
      <CardContent>
        <div className="space-y-4 pt-6">
          {notes.map((note, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-[75%] flex-col gap-2 rounded-lg border px-3 py-2 text-sm',
                false
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <span>{note.message}</span>
              <span className="text-xs text-gray-500">
                {moment(note.createdDate).format('lll')}
              </span>
              <span className="text-xs italic text-gray-500">
                &minus; {note.user}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            variant="secondary"
            size="icon"
            disabled={false}
            onClick={() => {
              addNote.mutate({
                collectionId: params?.id,
                message: input
              });
            }}
          >
            <Icon
              icon="plus"
              // currentColor
              size={16}
              className="h-4 w-4"
            />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CollectionNotes;
