import React from 'react';
import { Flex, Box, Text, BoxProps, ChevronIcon } from '@blockstack/ui';
import { useHover } from 'use-events';

interface FaqItem {
  title: string;
  body: string;
}

export const onboardingFaq = (appName: string): FaqItem[] => {
  return [
    {
      title: 'Where should I save my Secret Key?',
      body: `
      Save your Secret Key in a place where only you can find it. For example:
      <br><br>
      <ul style="list-style: none;">
      <li>• A password manager such as 1Password</li>
      <li>• Your Notes app, protected with a password</li>
      <li>• Written down and kept somewhere safe</li>
      </ul>
      <br>
      Don’t save it anywhere where others can find it, or on a website you do not trust. Anybody with your Secret Key will have access to the apps you use.
    `,
    },
    {
      title: 'What if I lose my Secret Key?',
      body:
        'If you lose your Secret Key, it will be lost forever. Only you know your Secret Key, which means that no one can help you recover it.',
    },
    {
      title: 'When will I need my Secret Key?',
      body: `You’ll use your Secret Key to prove it’s you when you want to use ${appName} on a new device, such as your phone or laptop. Your Secret Key will stay active on your devices and keep you private in the apps you use.`,
    },
    {
      title: 'Why don’t I have a password?',
      body: `
        Your Secret Key keeps you private in the apps you use it with. It does this by protecting everything you do with encryption, so that ${appName} can't see or track your activity.
        <br><br>
        To access your apps and data, the Secret Key is required. Only you have your Secret Key because it's created independently from ${appName}, so no one else can access your data. Blockstack, an open-source protocol, generated your Secret Key when you signed up for ${appName}.
      `,
    },
  ];
};

interface TitleProps extends BoxProps {
  isFirst: boolean;
  isOpen: boolean;
  hovered: boolean;
}

const TitleElement: React.FC<TitleProps> = ({ onClick, isFirst, isOpen, hovered, title }) => (
  <Flex
    align="center"
    borderBottom={!isOpen ? '1px solid' : undefined}
    borderTop={isFirst ? '1px solid' : 'unset'}
    borderColor="#E5E5EC" // this is not currently in the UI lib, asked jasper about it but he was out of office
    // height="48px"
    pt={4}
    pb={isOpen ? 0 : 4}
    justify="space-between"
    onClick={onClick}
  >
    <Box>
      <Text textStyle="body.small" color={isOpen || hovered ? 'ink' : 'ink.600'}>
        {title}
      </Text>
    </Box>
    <Box color="ink.300">
      <ChevronIcon direction={isOpen ? 'up' : 'down'} />
    </Box>
  </Flex>
);

interface BodyProps {
  body: string;
}

const Body: React.FC<BodyProps> = ({ body }) => (
  <Box
    borderBottom="1px solid"
    borderColor="#E5E5EC" // this is not currently in the UI lib, asked jasper about it but he was out of office
    py={3}
  >
    <Text color="ink.600">
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </Text>
  </Box>
);

interface FaqContent {
  title: string;
  body: string;
  tracking?: string;
  icon?: string;
}

interface CollapseItemProps extends FaqContent {
  handleOpen: (key: number) => void;
  id: number;
  open: number | null;
}

const CollapseItem: React.FC<CollapseItemProps> = ({ handleOpen, id, title, body, open }) => {
  const [hovered, bind] = useHover();
  return (
    <Box cursor={hovered ? 'pointer' : undefined} lineHeight="16px" {...bind}>
      <TitleElement
        onClick={() => {
          handleOpen(id);
        }}
        isFirst={id === 0}
        title={title}
        hovered={hovered}
        isOpen={id === open}
      />
      {open === id ? <Body body={body} /> : null}
    </Box>
  );
};

interface CollapseProps extends BoxProps {
  content: FaqContent[];
}

/**
 * This component renders a list of clickable items that
 * will reveal content onClick, then hide it on any other
 * onClick of an item
 */
export const Collapse: React.FC<CollapseProps> = ({ content, ...rest }) => {
  const [open, setOpen] = React.useState<number | null>(null);
  const handleOpen = (key: number) => (key === open ? setOpen(null) : setOpen(key));
  return (
    <Box fontSize="12px" {...rest}>
      {/*
          It's important to include the rest of the props
          because in certain cases we want to add/adjust spacing,
          eg if this is contained in <Stack> it will add
          spacing automatically

          A pattern we're trying to follow is that these components
          will not have margin in and of themselves. No component should
          have default whitespace
      */}
      {content.map(({ title, body }, key) => {
        return (
          <CollapseItem
            key={key}
            id={key}
            title={title}
            body={body}
            open={open}
            handleOpen={handleOpen}
          />
        );
      })}
    </Box>
  );
};
