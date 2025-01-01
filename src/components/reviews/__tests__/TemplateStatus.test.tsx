import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateStatus } from '../TemplateStatus';
import { updateTemplateStatus } from '../../../lib/database/templates';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../../lib/database/templates', () => ({
  updateTemplateStatus: vi.fn()
}));

describe('TemplateStatus', () => {
  const defaultProps = {
    id: 'template-1',
    status: 'draft' as const,
    onStatusChange: vi.fn()
  };

  it('displays current status', () => {
    render(<TemplateStatus {...defaultProps} />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('toggles status when clicked', async () => {
    (updateTemplateStatus as any).mockResolvedValue({ status: 'active' });
    
    render(<TemplateStatus {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('template-status-toggle'));
    
    expect(updateTemplateStatus).toHaveBeenCalledWith('template-1', 'active');
    expect(defaultProps.onStatusChange).toHaveBeenCalled();
  });

  it('handles errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    (updateTemplateStatus as any).mockRejectedValue(new Error('Failed to update'));
    
    render(<TemplateStatus {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('template-status-toggle'));
    
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});