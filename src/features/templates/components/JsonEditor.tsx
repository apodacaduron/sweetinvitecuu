import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/features/cms/context/BlocksContext';

type JsonEditorProps = {
  value: Block[];
  onChange: (value: Block[]) => void; // now can be object or string
  onBlur?: () => void;
};

export function JsonEditor({ value, onChange, onBlur }: JsonEditorProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof value === 'string') {
      setText(value);
    } else {
      setText(JSON.stringify(value, null, 2));
    }
    setError(null);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setError(null);

    try {
      const parsed = JSON.parse(val) as Block[];
      onChange(parsed);
    } catch {
      // send raw string if invalid JSON
      onChange(val as unknown as Block[]);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setText(formatted);
      onChange(parsed);
      setError(null);
    } catch (e) {
      setError('Cannot format: ' + e);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={handleChange}
        onBlur={onBlur}
        className="font-mono min-h-[300px]"
      />

      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={formatJson}>
          Format JSON
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
