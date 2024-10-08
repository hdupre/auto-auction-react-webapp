import { promises as fs } from 'fs';
import path from 'path';
import AuctionTabs from './components/AuctionTabs'; // Separate client component for rendering Tabs

export default async function AuctionList() {
    // Read the JSON file asynchronously on the server side
    const file = await fs.readFile(path.join(process.cwd(), 'app/data/output.json'), 'utf8');
    const data = JSON.parse(file);

    // Ensure data is valid and pass it to the client component
    if (!Array.isArray(data) || data.length === 0) {
        return <div>No auction data available</div>;
    }

    return <AuctionTabs data={data} />; // Pass data to the client component
}
