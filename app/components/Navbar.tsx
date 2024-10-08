"use client";
import { NavLink, Box } from "@mantine/core";
import { IconHome, IconSettings, IconCar } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use this instead of useSelectedLayoutSegment

const data = [
    { icon: IconHome, label: 'Auctions', href: '/' }, // Root route
    { icon: IconCar, label: 'My Alerts', href: '/my-alerts' },
    { icon: IconSettings, label: 'About', href: '/about' }
];

function Navbar() {
    const pathname = usePathname(); // Get the current pathname

    const items = data.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); // Check if root or matching path

        return (
            <Link href={item.href} key={item.label} passHref legacyBehavior>
                <NavLink
                    component="a"
                    label={item.label}
                    leftSection={<item.icon size="1rem" stroke={1.5} />}
                    active={isActive} // Highlight active link
                />
            </Link>
        );
    });

    return <Box w={150}>{items}</Box>;
}

export default Navbar;