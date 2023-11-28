import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Modal as DefaultModal } from 'src/client/components/Modal';
import type { Channel } from 'src/client/consts/Channel';
import { CloseButton } from 'src/client/components/Buttons';
import { Colors } from 'src/client/consts/Colors';

export function ChannelPicker({
  channels,
  onSelect,
}: {
  channels: Channel[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [channelText, setChannelText] = useState('');
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(0);
  const [filteredChannels, setFilteredChannels] = useState(channels);
  const selectedRef = useRef<HTMLLIElement>(null);

  const handleClose = useCallback(() => {
    setChannelText('');
    setSelectedChannelIndex(0);
    setFilteredChannels(channels);
    setOpen(false);
  }, [channels]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!open) {
        if (event.metaKey && event.key === 'k') {
          setOpen(true);
        }
      } else {
        if (event.key === 'Escape') {
          handleClose();
        } else if (event.key === 'Enter') {
          if (filteredChannels.length) {
            onSelect(filteredChannels[selectedChannelIndex].id);
            handleClose();
          }
        } else if (event.key === 'ArrowDown') {
          if (filteredChannels.length) {
            setSelectedChannelIndex(
              (selectedChannelIndex + 1) % filteredChannels.length,
            );
          }
        } else if (event.key === 'ArrowUp') {
          if (filteredChannels.length) {
            setSelectedChannelIndex(
              selectedChannelIndex === 0
                ? filteredChannels.length - 1
                : selectedChannelIndex - 1,
            );
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [
    open,
    channels,
    filteredChannels,
    selectedChannelIndex,
    channelText,
    handleClose,
    onSelect,
  ]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView();
  }, [selectedChannelIndex]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value.trim();
      setChannelText(text);
      const newFilteredChannels = channels.filter((channel) =>
        channel.id.includes(text),
      );
      setFilteredChannels(newFilteredChannels);
      if (newFilteredChannels.length && filteredChannels.length) {
        const currentID = filteredChannels[selectedChannelIndex].id;
        let newSelectedChannelIndex = 0;
        newFilteredChannels.forEach((channel, index) => {
          if (channel.id === currentID) {
            newSelectedChannelIndex = index;
          }
        });
        setSelectedChannelIndex(newSelectedChannelIndex);
      }
    },
    [channels, filteredChannels, selectedChannelIndex],
  );

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalHeading>Switch to channel</ModalHeading>
          <CloseButton onClick={handleClose} />
        </ModalHeader>
        <InputWrapper>
          <Input
            placeholder="general"
            type="text"
            autoComplete="off"
            spellCheck="false"
            autoFocus={true}
            value={channelText}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
              }
            }}
          />
        </InputWrapper>
        <List>
          {filteredChannels.map((channel) =>
            channel.id === filteredChannels[selectedChannelIndex].id ? (
              <SelectedListItem key={channel.id} ref={selectedRef}>
                #{channel.id}
              </SelectedListItem>
            ) : (
              <ListItem key={channel.id}>#{channel.id}</ListItem>
            ),
          )}
        </List>
      </Box>
    </Modal>
  );
}

const Box = styled.div({
  backgroundColor: 'white',
  borderRadius: '12px',
  color: 'black',
  gap: '12px',
  width: '520px',
  margin: 'auto',
  padding: '20px 28px',
});

const Modal = styled(DefaultModal)`
  display: flex;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
`;

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  padding: '24px 0 12px',
});

const ModalHeading = styled.h2({
  display: 'flex',
  marginTop: 0,
});

const InputWrapper = styled.div({
  marginTop: '8px',
  border: '1px solid rgba(29,28,29 ,0.3)',
  borderRadius: '4px',
  display: 'flex',
  '&:focus-within': {
    outline: '3px solid #c2e1f2',
    border: '1px solid #1164A3',
  },
});

const Input = styled.input({
  boxSizing: 'border-box',
  height: '42px',
  padding: '4px 8px',
  fontSize: '18px',
  fontWeight: '400',
  border: 'none',
  width: '100%',
  outline: 'none',
  borderRadius: '4px',
});

const List = styled.ul({
  listStyle: 'none',
  maxHeight: '150px',
  overflow: 'scroll',
  paddingLeft: '0px',
});

const ListItem = styled.li({
  marginBottom: '3px',
  padding: '4px',
  fontSize: '18px',
});

const SelectedListItem = styled.li({
  marginBottom: '3px',
  padding: '4px',
  fontSize: '18px',
  background: Colors.blue_active,
  color: 'white',
  borderRadius: '6px',
});
