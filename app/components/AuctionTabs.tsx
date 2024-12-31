"use client";

import { Tabs } from '@mantine/core';
import { AuctionDataTable } from './AuctionDataTable';

interface AuctionTabProps {
    data: {
        global: {
            auction_date: string;
            borough: string;
            location_order: number;
        };
        records: {
            lot_number: number[];
            state: string[];
            vin: string[];
            model_year: number[];
            make: string[];
            model: string[];
            trim_level: string[];
            series: string[];
            body_class: string[];
            drive_type: string[];
            cylinders: number[];
            displacement: number[];
            transmission: string[];
            lienholder_name: string[];
        };
    }[];
}

const capitalize = (name: string): string => {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

const generateAuctionKey = (auction: AuctionTabProps['data'][0]): string => {
    return `${auction.global.auction_date}-${auction.global.borough}-${auction.global.location_order}`;
};

export default function AuctionTab({ data }: AuctionTabProps) {
    return (
        <Tabs defaultValue={generateAuctionKey(data[0])}>
            <Tabs.List spacing="md" radius="md" sx={{ justifyContent: 'flex-end' }}>
                {data.map((auction) => (
                    <Tabs.Tab
                        key={generateAuctionKey(auction)}
                        value={generateAuctionKey(auction)}
                        color="blue"
                        sx={{ width: '150px', textAlign: 'left', flexGrow: 0 }}
                    >
                        {`${capitalize(auction.global.borough)} - ${formatDate(auction.global.auction_date)}${
                            auction.global.location_order > 1 ? ` - ${auction.global.location_order}` : ''
                        }`}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {data.map((auction) => (
                <Tabs.Panel key={`${generateAuctionKey(auction)}-panel`} value={generateAuctionKey(auction)}>
                    <AuctionDataTable auctionData={auction} />
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}