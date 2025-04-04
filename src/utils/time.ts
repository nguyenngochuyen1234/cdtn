export const formatTo12Hour = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true, // Sử dụng định dạng 12 giờ
    });
};
