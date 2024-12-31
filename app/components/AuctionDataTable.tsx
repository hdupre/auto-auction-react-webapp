import { useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';

interface AuctionDataTableProps {
    auctionData: {
        global: {
            auction_date: string;
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
    };
}

interface TableRecord {
    id: string;
    lot_number: number;
    state: string;
    vin: string;
    year: number | string;
    make: string;
    model: string;
    trim: string;
    series: string;
    body: string;
    drive: string;
    cylinders: number;
    displacement: number;
    transmission: string;
    lienholder: string;
}

const DetailRow = ({ record }: { record: TableRecord }) => {
    const getTrimDisplay = () => {
        return record.trim !== '-' ? record.trim :
            record.series !== '-' ? record.series : '-';
    };

    const getBodyStyle = () => {
        return record.body && record.body !== '-'
            ? record.body.split('(')[0].trim()
            : '-';
    };

    const getDriveType = () => {
        return record.drive && record.drive !== '-'
            ? record.drive.split('/')[0]
            : '-';
    };

    const getEngine = () => {
        if (!record.cylinders || !record.displacement) return '-';
        return `${record.cylinders} cyl ${record.displacement}L`;
    };

    const getTransmission = () => {
        return record.transmission && record.transmission !== '-'
            ? record.transmission.split('(')[0].trim()
            : '-';
    };

    const getLienholder = () => {
        return record.lienholder && record.lienholder !== '-'
            ? record.lienholder.replace(/;/g, ' ')
            : '-';
    };

    return (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <div className="text-sm font-semibold text-gray-500">Trim</div>
                    <div>{getTrimDisplay()}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-500">Body Style</div>
                    <div>{getBodyStyle()}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-500">Drive Type</div>
                    <div>{getDriveType()}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-500">Engine</div>
                    <div>{getEngine()}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-500">Transmission</div>
                    <div>{getTransmission()}</div>
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-500">State/Lienholder</div>
                    <div>{record.state} / {getLienholder()}</div>
                </div>
            </div>
        </div>
    );
};

export function AuctionDataTable({ auctionData }: AuctionDataTableProps) {
    const [sortStatus, setSortStatus] = useState<{ columnAccessor: string; direction: 'asc' | 'desc' }>({
        columnAccessor: 'lot_number',
        direction: 'asc'
    });
    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([]);

    const records: TableRecord[] = auctionData.records.lot_number.map((lot: number, index: number) => ({
        id: `${auctionData.global.auction_date}-${lot}`,
        lot_number: lot,
        state: auctionData.records.state[index] || '-',
        vin: auctionData.records.vin[index] || '-',
        year: auctionData.records.model_year[index] || '-',
        make: auctionData.records.make[index] || '-',
        model: auctionData.records.model[index] || '-',
        trim: auctionData.records.trim_level[index] || '-',
        series: auctionData.records.series[index] || '-',
        body: auctionData.records.body_class[index] || '-',
        drive: auctionData.records.drive_type[index] || '-',
        cylinders: auctionData.records.cylinders[index],
        displacement: auctionData.records.displacement[index],
        transmission: auctionData.records.transmission[index] || '-',
        lienholder: auctionData.records.lienholder_name[index] || '-',
    }));

    // Define columns with explicit types
    const columns: Array<DataTableColumn<TableRecord>> = [
        {
            accessor: (record: TableRecord) => record.id, // Functional accessor
            title: '',
            width: 40,
            render: (record: TableRecord) => (
                <button
                    onClick={() => {
                        setExpandedRecordIds((ids) =>
                            ids.includes(record.id)
                                ? ids.filter((id) => id !== record.id)
                                : [...ids, record.id]
                        );
                    }}
                    className="p-1"
                >
                    {expandedRecordIds.includes(record.id) ? (
                        <IconChevronDown size={16} />
                    ) : (
                        <IconChevronRight size={16} />
                    )}
                </button>
            ),
        },
        {
            accessor: 'lot_number', // String-based accessor for TableRecord
            title: 'Lot #',
            width: 70,
        },
        {
            accessor: 'year', // String-based accessor for TableRecord
            title: 'Year',
            width: 70,
        },
        {
            accessor: 'make', // String-based accessor for TableRecord
            title: 'Make',
            width: 120,
        },
        {
            accessor: 'model', // String-based accessor for TableRecord
            title: 'Model',
            width: 120,
        },
        {
            accessor: 'vin', // String-based accessor for TableRecord
            title: 'VIN',
            width: 200,
            style: { whiteSpace: 'nowrap' },
            ellipsis: true,
        },
    ] as Array<DataTableColumn<TableRecord>>; // Explicit type assertion


    return (
        <DataTable<TableRecord>
            columns={columns}
            records={records}
            idAccessor="id"
            onSortStatusChange={setSortStatus}
            sortStatus={sortStatus}
            highlightOnHover
            striped
            noRecordsText="No auction items to show"
            minHeight={300}
            height="calc(100vh - 200px)"
            rowExpansion={{
                content: ({ record }) => <DetailRow record={record} />,
                allowMultiple: true,
                expanded: {
                    recordIds: expandedRecordIds,
                    onRecordIdsChange: setExpandedRecordIds,
                },
            }}
        />
    );
}