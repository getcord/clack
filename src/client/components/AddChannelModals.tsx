import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useContext, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HashtagIcon } from '@heroicons/react/20/solid';
import { ActionButton, CloseButton } from 'src/client/components/Buttons';
import { Modal as DefaultModal } from 'src/client/components/Modal';
import { useAPIUpdateFetch } from 'src/client/hooks/useAPIFetch';
import { ChannelsContext } from 'src/client/context/ChannelsProvider';

export function AddChannelModals({
  isOpen,
  setModalOpen,
}: {
  isOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [step, setStep] = useState(1);
  const [newChannelName, setNewChannelName] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const update = useAPIUpdateFetch();
  const navigate = useNavigate();

  const { refetch: refetchChannels } = useContext(ChannelsContext);

  const createChannel = useCallback(() => {
    void update(`/channels/${newChannelName}`, 'PUT', {
      isPrivate,
    }).then(() => {
      setModalOpen(false);
      setStep(1);
      setNewChannelName('');
      setIsPrivate(false);
      refetchChannels();
      navigate(`/channel/${newChannelName}`);
    });
  }, [
    isPrivate,
    navigate,
    newChannelName,
    refetchChannels,
    setModalOpen,
    update,
  ]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setModalOpen(false)}>
        {step === 1 ? (
          <Box onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalHeading>Create a channel</ModalHeading>
              <CloseButton onClick={() => setModalOpen(false)} />
            </ModalHeader>
            <label>
              <Title>Name</Title>
            </label>
            <InputWrapper>
              <Hashtag />
              <Input
                placeholder="e.g. snack-drawer"
                type="text"
                autoComplete="off"
                spellCheck="false"
                value={newChannelName}
                onChange={(e) => {
                  const noSpaces = e.target.value.replace(' ', '-');
                  setNewChannelName(noSpaces);
                }}
              />
            </InputWrapper>
            <HintText>
              Channels are where conversations happen around a topic. Use a name
              that is easy to find and understand.
            </HintText>
            <Footer>
              <FooterText>Step {step} of 2</FooterText>
              <ActionButton
                $variant={newChannelName ? 'primary' : 'secondary'}
                disabled={!newChannelName}
                onClick={() => setStep(2)}
              >
                Next
              </ActionButton>
            </Footer>
          </Box>
        ) : (
          <Box onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalHeading>Create a channel</ModalHeading>
              <LowerHeading># {newChannelName}</LowerHeading>
            </ModalHeader>
            <FieldSet>
              <Legend>Visibility</Legend>
              <RadioLabel>
                <input
                  type="radio"
                  checked={!isPrivate}
                  onChange={(e) => setIsPrivate(!e.target.checked)}
                />
                <span>Public - anyone in Clack</span>
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <span>Private - Only specific people</span>
              </RadioLabel>
            </FieldSet>
            <Footer>
              <FooterText>Step {step} of 2</FooterText>
              <ButtonsContainer>
                <ActionButton $variant={'secondary'} onClick={() => setStep(1)}>
                  Back
                </ActionButton>
                <ActionButton $variant={'primary'} onClick={createChannel}>
                  Create
                </ActionButton>
              </ButtonsContainer>
            </Footer>
          </Box>
        )}
      </Modal>
    </>
  );
}

const ModalHeading = styled.h2({
  display: 'flex',
  marginTop: 0,
});

const ButtonsContainer = styled.div({
  gap: '12px',
  display: 'flex',
});

const Legend = styled.legend({
  fontSize: '15px',
  fontWeight: 700,
  paddingBottom: '8px',
});

const FieldSet = styled.fieldset({
  border: 'none',
  marginBottom: '24px',
  paddingLeft: '0px',
});

const RadioLabel = styled.label({
  display: 'flex',
  marginBottom: '4px',
});

const LowerHeading = styled.h2({
  color: 'rgba(29, 28, 29.7)',
  fontSize: '13px',
  fontWeight: '400',
  lineHeight: '1.38463',
});

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  padding: '24px 0 12px',
});

const Footer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const FooterText = styled.span({
  color: 'rgba(97, 96, 97, 1)',
  fontWeight: 400,
});

const HintText = styled.div({
  color: 'rgba(97,96,97,1)',
  fontSize: '13px',
  fontWeight: '400',
  lineHeight: '1.38461538',
  margin: '4px 0 20px',
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

const Title = styled.span({
  fontSize: '15px',
  fontWeight: '700',
  paddingBottom: '8px',
});

const Modal = styled(DefaultModal)`
  display: flex;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
`;

const Box = styled.div({
  backgroundColor: 'white',
  borderRadius: '12px',
  color: 'black',
  gap: '12px',
  width: '520px',
  margin: 'auto',
  padding: '20px 28px',
});

const Hashtag = styled(HashtagIcon)`
  width: 18px;
  padding-left: 8px;
  color: rgba(97, 96, 97, 1);
`;

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
