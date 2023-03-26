export type FileListType = {
	name: string;
	url: string;
	progress: number;
	file: File;
	type: string;
	size: number;
	error?: "";
};

export enum UpdateKey {
	URL_Update = "URL_Update",
	Progress_Update = "Progress_Update",
}

export type Error = {
	fileSizeError: string;
	fileTypeError: string;
};

export type Option = {
	headers: {
		"Content-Type": string;
	};
	onUploadProgress: (progressEvent: any) => void;
};

export type VideoProps = {
	FileList: FileListType[];
};

export type DragDropProps = {
	Error: Error;
	FileInputRef: React.RefObject<HTMLDivElement>;
	Dragging: boolean;
	DragRef: React.RefObject<HTMLDivElement>;
};

export type ShowFileProps = {
	FileList: FileListType[];
	Error: Error;
};
