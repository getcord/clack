import React, { useState } from 'react';
import { styled } from 'styled-components';
import EmojiPicker, { Emoji, EmojiStyle } from 'emoji-picker-react';
import { CloseButton } from 'src/client/components/Buttons';
import type { UserStatus } from 'src/client/hooks/useUserStatus';
import { Colors } from 'src/client/consts/Colors';
import { SmileyFaceSvg } from 'src/client/components/svg/SmileyFaceSVG';

interface SetStatusMenuProps {
  onCancel: () => void;
  onClose: () => void;
  status: UserStatus | null;
  updateStatus: (newStatus: UserStatus | null) => void;
}

export function SetStatusMenu({
  onCancel,
  onClose,
  status,
  updateStatus,
}: SetStatusMenuProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [input, setInput] = useState(status);

  const onSubmit = () => {
    updateStatus(input);
    onClose();
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <Heading>Set a status</Heading>
      {showEmojiPicker && (
        <div style={{ position: 'absolute' }}>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setInput((prev) => ({
                ...prev,
                emojiUnified: emoji.unified,
                emojiUrl: emoji.getImageUrl(EmojiStyle.APPLE),
              }));
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
      <InputBox htmlFor="status-input" onClick={(e) => e.stopPropagation()}>
        <button
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={(e) => {
            e.preventDefault();
            setShowEmojiPicker(true);
          }}
        >
          {input?.emojiUnified ? (
            <Emoji size={20} unified={input.emojiUnified} />
          ) : (
            <StyledSmiley />
          )}
        </button>
        <Input
          id="status-input"
          name="status"
          placeholder="What's your status?"
          value={input?.text ?? undefined}
          onChange={(e) =>
            setInput((prev) => ({ ...prev, text: e.target.value }))
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
        />
        <CloseButton
          onClick={() =>
            setInput({ emojiUnified: null, emojiUrl: null, text: '' })
          }
        />
      </InputBox>
      <Footer>
        <Button $variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          $variant="primary"
          disabled={input?.text === status?.text}
          onClick={onSubmit}
        >
          Save
        </Button>
      </Footer>
    </Box>
  );
}

const Footer = styled.div({
  display: 'flex',
  justifyContent: 'end',
  gap: '12px',
  paddingTop: '20px',
});

const Button = styled.button<{
  $variant: 'primary' | 'secondary';
  $disabled?: boolean;
}>(({ $variant }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  minWidth: '56px',
  borderRadius: '4px',
  '&:disabled': {
    cursor: 'auto',
    backgroundColor: Colors.gray_light,
    color: Colors.gray_text,
    border: 'none',
  },
  padding: '0 12px 1px',
  border: `1px solid ${Colors.gray_border}`,
  backgroundColor: $variant === 'primary' ? Colors.green : 'white',
  color: $variant === 'primary' ? 'white' : 'black',
  fontWeight: 700,
  fontSize: '13px',
  height: '28px',
}));

const Box = styled.div({
  position: 'relative',
  width: '50%',
  maxWidth: '520px',
  borderRadius: '8px',
  backgroundColor: 'white',
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
});

const Heading = styled.h3({
  marginTop: 0,
});

const InputBox = styled.label({
  borderRadius: '4px',
  backgroundColor: 'white',
  border: `1px solid ${Colors.gray_border}`,
  padding: '7px',
  color: Colors.gray_dark,
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '&:focus-within': {
    boxShadow: `0 0 0 1px ${Colors.blue_selected_border}, 0 0 0 5px #1d9bd14d`,
  },
  cursor: 'text',
});

const Input = styled.input({
  all: 'unset',
  flex: 1,
});

const StyledSmiley = styled(SmileyFaceSvg)`
  height: 20px;
  width: 20px;
  cursor: pointer;
`;
