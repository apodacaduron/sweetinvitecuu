import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Block, BlockBase, RsvpProperties } from '../../context/BlocksContext';
import { useEditableBlocks } from '../../context/EditableBlocksContext';
import { EditBlockWrapper } from './EditBlockWrapper';

export default function RsvpBlock(props: BlockBase<RsvpProperties> & { type: "rsvp" }) {
  const { updateBlock } = useEditableBlocks();

  return (
    <EditBlockWrapper
      block={props as Block}
      onClickVisibility={(visible) => updateBlock({ ...props, visible })}
    >
      <div className="space-y-4 pt-2 text-muted-foreground">
        <Label>Name</Label>
        <Input disabled placeholder="Tu nombre" />

        <Label>Teléfono</Label>
        <Input disabled type="tel" placeholder="(123) 456 7891" />

        <Label>¿Podrás Asistir?</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Si, asistiré</SelectItem>
            <SelectItem value="no">No, lo siento</SelectItem>
          </SelectContent>
        </Select>

        <Label>Número de personas que asistirán</Label>
        <Input
          disabled
          type="number"
          placeholder="No exceder el número de invitados"
        />

        <Label>Mensaje</Label>
        <Textarea disabled placeholder="Escribe un mensaje o buenos deseos" />

        <Button type="submit" className="w-full mt-4" disabled>
          Save
        </Button>
      </div>
    </EditBlockWrapper>
  );
}
