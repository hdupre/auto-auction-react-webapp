"use client";

import { AppShell, Burger, Flex, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import logoPic from './assets/LOGO_NoBR.png';
import Navbar from './components/Navbar';

export default function ClientAppShell({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 80 }}
            navbar={{
                width: 180,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header style={{ display: 'flex', alignItems: 'center' }}>
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <Flex align="center" gap="sm" ml="10px">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Image src={logoPic} width={50} height={50} />
                        <Text>NYC Auto Auctions</Text>
                    </Flex>
                    <Button mr="20px">Login / Sign Up</Button>
                </Flex>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Navbar />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
