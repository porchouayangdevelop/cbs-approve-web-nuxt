
export const FormatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(parseInt(dateString)).toLocaleDateString();
}