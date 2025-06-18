import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGrandmasters } from '../../services/chessService';

import { DataTable } from 'primereact/datatable';
import type { DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import axios from 'axios';

export default function GrandmastersList() {
  const [data, setData] = useState<{ username: string }[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0,
    globalFilter: '',
  });

  const navigate = useNavigate();

  const loadData = async (signal: AbortSignal) => {
    try {
      setLoading(true);

      const all = await fetchGrandmasters(signal);
      const filtered = all.players.filter((username: string) =>
        username.toLowerCase().includes(lazyParams.globalFilter.toLowerCase())
      );

      const paginated = filtered.slice(
        lazyParams.first,
        lazyParams.first + lazyParams.rows
      );

      setData(paginated.map((username) => ({ username })));
      setTotalRecords(filtered.length);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    loadData(signal);

    return () => {
      controller.abort();
    };
  }, [lazyParams]);

  const onPage = (e: DataTableStateEvent) => {
    setLazyParams({
      ...lazyParams,
      first: e.first!,
      rows: e.rows!,
      page: e.page!,
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLazyParams({ ...lazyParams, globalFilter: e.target.value, first: 0 });
  };

  const actionTemplate = (username: string) => (
    <Button
      key={`view-${username}`}
      className="p-button-text p-button-sm"
      tooltip={`View ${username}`}
      onClick={() => navigate(`/player/${username}`)}
    >
      <span className="pi pi-eye !text-2xl" />
    </Button>
  );

  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Chess Grandmasters</h2>
        <span className="relative w-full sm:w-auto">
          <i className="pi pi-search absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
          <InputText
            value={lazyParams.globalFilter}
            onChange={onSearch}
            placeholder="Search username..."
            pt={{
              root: {
                className: 'w-full sm:w-[250px] !pl-10',
              },
            }}
          />
        </span>
      </div>

      <div className="relative w-full">
        <DataTable
          value={data}
          lazy
          paginator
          loading={loading}
          first={lazyParams.first}
          rows={lazyParams.rows}
          totalRecords={totalRecords}
          onPage={onPage}
          dataKey="username"
          responsiveLayout="scroll"
          className="w-full"
          emptyMessage={!loading ? 'No grandmasters found.' : ''}
          tableStyle={{ minHeight: '40rem' }}
        >
          <Column
            field="username"
            header="Username"
            body={(rowData) => <span>{rowData.username}</span>}
          />
          <Column
            header="Action"
            body={(rowData) => actionTemplate(rowData.username)}
            pt={{
              headerCell: { className: 'w-[100px]' },
              bodyCell: { className: 'w-[100px]' },
            }}
          />
        </DataTable>
      </div>
    </div>
  );
}
