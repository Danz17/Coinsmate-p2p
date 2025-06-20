import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('CSV export', () => {
  test('quotes note field when note contains comma', () => {
    render(<App />);

    // Fill form in buy tab
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'OXS' } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('Rate'), { target: { value: '60' } });
    fireEvent.change(selects[1], { target: { value: 'BPI' } });
    fireEvent.change(selects[2], { target: { value: 'Allen' } });
    fireEvent.change(screen.getByPlaceholderText('Note (optional)'), { target: { value: 'hello, world' } });
    fireEvent.click(screen.getByText(/submit buy/i));

    // Switch to export tab
    fireEvent.click(screen.getByText(/export/i));

    let csv = '';
    const originalBlob = global.Blob;
    global.Blob = function(content) { csv = content[0]; };
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'blob:mock');

    fireEvent.click(screen.getByText(/export to csv/i));

    global.Blob = originalBlob;
    URL.createObjectURL = originalCreateObjectURL;

    expect(csv).toContain('"hello, world"');
  });
});
