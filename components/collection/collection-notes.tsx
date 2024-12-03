'use client';

import api from '@/api';
import { CollectionNote } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
import Empty from '../ui/empty';
import Icon from '../ui/icon';
import { Textarea } from '../ui/textarea';
import { NotebookTabs, NotepadText, Send } from 'lucide-react';

interface Props {
  notes: CollectionNote[];
}

function CollectionNotes({ notes }: Props) {
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(['user-info']) as any;
  const router = useRouter();
  const t = useTranslations();
  const params = useParams();
  const [input, setInput] = useState('');

  const addNote = useMutation({
    mutationFn: async (values: any) => {
      const res = await api.post('/CollectionNotes', values);
      return res;
    },
    onSuccess: (res) => {
      router.refresh();
      toast.success(t('item_added'), {
        description: moment().format('DD/MM/YYYY, HH:mm')
      });
      setInput('');
    }
  });

  return (
    <Card>
      <CardHeader className="h-16 flex-row items-center gap-2 border-b py-0">
        <NotebookTabs className="size-6" />
        <CardTitle className="text-lg">{t('notes')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-6">
          {notes.length > 0 ? (
            notes.map((note, index) => (
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
            ))
          ) : (
            <Empty className="py-12" />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Textarea
            id="message"
            placeholder="Type your message..."
            className="h-10 flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            // variant="outline"
            size="icon"
            className="size-12"
            disabled={false}
            onClick={() => {
              addNote.mutate({
                collectionId: params?.id,
                message: input
              });
            }}
          >
            <Send className="size-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CollectionNotes;
