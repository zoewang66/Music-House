import React from 'react';
import { Group, TextInput, Textarea, MultiSelect } from '@mantine/core';
import PageContainer from "../PageContainer";

/**
 * A reusable form component that renders labeled inputs for
 * Name, Description, and a multi-select list of songs.
 *
 * Props:
 * - name: string
 * - onNameChange: (value: string) => void
 * - description: string
 * - onDescriptionChange: (value: string) => void
 * - allSongs: { value: string; label: string }[]
 * - selected: string[]
 * - onSelectedChange: (values: string[]) => void
 */
export default function PlaylistFormFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  allSongs,
  selected,
  onSelectedChange,
}) {
  return (
    <PageContainer>
    <Group direction="column" spacing="xl" sx={{ maxWidth: 600, width: '100%' }}>
      <TextInput
        label="Name"
        value={name}
        onChange={(e) => onNameChange(e.currentTarget.value)}
        required
        fullWidth
        size="lg"
        sx={{}}
        styles={{
          input: { height: 50 },
        }}
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.currentTarget.value)}
        mt="md"
        fullWidth
        size="lg"
        minRows={5}
        styles={{
          input: { minHeight: 150 },
        }}
      />

      <MultiSelect
        label="Songs"
        placeholder="Select songs"
        data={allSongs}
        value={selected}
        onChange={onSelectedChange}
        mt="md"
        fullWidth
        size="lg"
      />
    </Group>
  );
}
