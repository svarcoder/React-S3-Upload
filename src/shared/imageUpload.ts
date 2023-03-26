import axios from "axios";
import { toast } from "react-toastify";
import { Error, FileListType, Option, UpdateKey } from "./type";

export const getPreSignedURl = async () => {
	let baseURL = process.env.REACT_APP_BASE_URL;
	return await axios.get(`${baseURL}`);
};

export const uploadVideo = async (url: string, file: File, option: Option) => {
	return await axios.put(url, file, option);
};

export const notify = (message: string) => toast.warn(message);

export const handleFileUpdate = (
	index: number,
	key: string,
	setState: React.Dispatch<React.SetStateAction<FileListType[]>>,
	value: number | string
) => {
	if ((key = UpdateKey?.Progress_Update) && typeof value === "number") {
		setState((prevState) => {
			const newArr = Array.from(prevState);
			const curr = newArr[index];
			curr.progress = Number(value);
			newArr[index] = curr;

			return newArr;
		});
	} else if ((key = UpdateKey?.URL_Update) && typeof value === "string") {
		setState((prevState) => {
			const newArr = Array.from(prevState);
			const curr = newArr[index];
			curr.url = value.toString();
			newArr[index] = curr;
			return newArr;
		});
	}
};

export function validateImageSize(
	files: any,
	setState: React.Dispatch<React.SetStateAction<Error>>
) {
	const maxSize = 1000000000;
	const minSize = 50000000;
	let data = false;

	files.forEach((item: any) => {
		if (item?.file?.type !== "video/mp4") {
			setState({
				fileSizeError: "",
				fileTypeError: "File is Not Supported.",
			});
			data = true;
		} else if (item?.file?.size > maxSize || item?.file?.size < minSize) {
			setState({
				fileSizeError:
					item?.file?.size > maxSize
						? "File is Too Large."
						: "File is Too Small.",
				fileTypeError: "",
			});
			data = true;
		}
	});

	if (data === false) {
		return false;
	} else {
		return true;
	}
}

export const handleSubmit = async (
	file: FileList | null,
	setFileList: React.Dispatch<React.SetStateAction<FileListType[]>>,
	setError: React.Dispatch<React.SetStateAction<Error>>
) => {
	try {
		if (!file) return;

		const files = Array.from(file).reduce((prev, curr) => {
			return [
				...prev,
				{
					file: curr,
					progress: 0,
					url: "",
					name: curr.name,
					type: curr.type,
					size: curr.size,
				},
			];
		}, [] as FileListType[]);

		setFileList(files);

		const validationResult: boolean = validateImageSize(files, setError);

		if (validationResult === false) {
			setError({
				fileSizeError: "",
				fileTypeError: "",
			});
			for (const i in files) {
				const file = files[i].file;
				getPreSignedURl()
					.then((getResultURL) => {
						const options: Option = {
							headers: {
								"Content-Type": file.type,
							},
							onUploadProgress: (progressEvent: any) => {
								const percentCompleted = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total
								);
								console.log({ percentCompleted });

								handleFileUpdate(
									Number(i),
									UpdateKey?.Progress_Update,
									setFileList,
									percentCompleted
								);
							},
						};

						uploadVideo(getResultURL?.data?.uploadUrl, file, options)
							.then((uploadImageResult) => {
								if (uploadImageResult) {
									const videoUrl = new URL(getResultURL?.data?.uploadUrl);
									handleFileUpdate(
										Number(i),
										UpdateKey?.URL_Update,
										setFileList,
										`${videoUrl.origin}${videoUrl.pathname}`
									);
								}
							})
							.catch((err) => {
								throw err;
							});
					})
					.catch((err) => {
						throw err;
					});
			}
		}
	} catch (error) {
		notify("Something went Wrong");
	}
};
