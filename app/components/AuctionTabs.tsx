"use client";

import { Tabs, TextInput, Group, Stack } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react'; // Import icons for Yes/No

// Helper function to capitalize borough names
const capitalize = (name) => {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper function to format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Helper function to concatenate model and trim/series
const getModelTrim = (model, series) => {
    if (model === 'N/A' && series === 'N/A') return '';
    if (model === 'N/A') return series;
    if (series === 'N/A') return model;
    return `${model} ${series}`;
};

// Generate a unique key for each auction tab
const generateAuctionKey = (auction) => {
    return `${auction.global.auction_date}-${auction.global.borough}-${auction.global.location_order}`;
};

export default function AuctionTabs({ data }) {
    return (
        <Tabs defaultValue={generateAuctionKey(data[0])}> {/* Default value is now based on the first auction's key */}
            <Tabs.List spacing="md" radius="md" sx={{ justifyContent: 'flex-end' }}>
                {data.map((auction) => (
                    <Tabs.Tab
                        key={generateAuctionKey(auction)}  // Generate a unique key for each tab
                        value={generateAuctionKey(auction)}  // Use the same key as the value for the tab
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
                    <AuctionDataTable records={auction.records} />
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}

function AuctionDataTable({ records }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Adjusted row mapping for consistency across all fields
    const filteredRows = records.vin.map((vin, index) => ({
        key: vin,  // Use VIN as the key (this is React's key, not a prop)
        model_year: records.model_year?.[index] || 'N/A',
        make: records.make?.[index] || 'N/A',
        model_trim: getModelTrim(records.model?.[index] || 'N/A', records.series?.[index] || 'N/A'),
        vin: vin || 'N/A',
        lienholder: records.lienholder_name?.[index] ? 'Yes' : 'No',
        lienholder_icon: records.lienholder_name?.[index] ? <IconCheck size={16} color="green" /> : <IconX size={16} color="red" />,
        body_class: records.body_class?.[index] || 'N/A',
        drive_type: records.drive_type?.[index] || 'N/A',
    }));

    // Filter logic for the search bar
    const displayedRows = filteredRows.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <>
            <TextInput
                placeholder="Search by Make, Model, Year, VIN"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                mb="sm"
            />
            <DataTable
                columns={[
                    { accessor: 'model_year', title: 'Model Year', sortable: true },
                    { accessor: 'make', title: 'Make', sortable: true },
                    { accessor: 'model_trim', title: 'Model/Trim', sortable: true },
                    { accessor: 'vin', title: 'VIN', sortable: true },
                    { accessor: 'lienholder_icon', title: 'Lienholder', sortable: true },
                ]}
                records={displayedRows}
                // No need for rowKey prop; React will use the key field from each record for uniqueness
                rowExpansion={{
                    content: ({ record }) => (
                        <Stack spacing={6} p="xs">
                            <Group spacing={6}>
                                <div><strong>Body Class:</strong> {record.body_class}</div>
                            </Group>
                            <Group spacing={6}>
                                <div><strong>Drive Type:</strong> {record.drive_type}</div>
                            </Group>
                        </Stack>
                    ),
                }}
            />
        </>
    );
}
