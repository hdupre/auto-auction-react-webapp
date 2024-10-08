import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';
import ClientAppShell from './ClientAppShell';

export const metadata = {
    title: 'NYC Auto Auctions',
    description: 'Auction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <ColorSchemeScript />
        </head>
        <body>
        <MantineProvider>
            <ClientAppShell>{children}</ClientAppShell>
        </MantineProvider>
        </body>
        </html>
    );
}
