export function formatNumber(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }

    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2) + 'B';
    }
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + 'M';
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(2) + 'k';
    }

    return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}