import React, { useState } from 'react';
import PlaylistFormFields from './components/CustomFormFields';

function PlaylistCreatePage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState([]);
  const allSongs = [
    { value: 'song1', label: 'Song One' },
    { value: 'song2', label: 'Song Two' },
    // …etc…
  ];

  const handleSubmit = () => {
    // use name, description, selected…
  };

  return (
    <>
      <PlaylistFormFields
        name={name}
        onNameChange={setName}
        description={description}
        onDescriptionChange={setDescription}
        allSongs={allSongs}
        selected={selected}
        onSelectedChange={setSelected}
      />
      <Button onClick={handleSubmit} mt="xl">Save Playlist</Button>
    </>
  );
}
