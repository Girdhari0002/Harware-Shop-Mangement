const FileUpload = ({ label = "Upload file", onChange, accept }) => {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-4 py-6 text-center hover:border-primary hover:bg-primary-light transition-colors">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <span className="mt-1 text-xs text-text-muted">Choose or drag and drop files here.</span>
      <input className="hidden" type="file" accept={accept} onChange={onChange} />
    </label>
  );
};

export default FileUpload;