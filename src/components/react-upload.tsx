import { useEffect, useRef, useState, useMemo } from "react";
import "./style.scss";
import Particles from "./particles";
import Video from "./video";
import DragDrop from "./drag-drop";
import ShowFile from "./show-file";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleSubmit } from "../shared/imageUpload";
import { Error, FileListType } from "../shared/type";
import { gsap } from "gsap";

const ReactUpload = () => {
	const fileInputRef = useRef<HTMLDivElement>(null);
	const drag = useRef<HTMLDivElement>(null);
	const timeline = useMemo(() => gsap.timeline({ paused: true }), []);
	const [fileList, setFileList] = useState<FileListType[]>([]);
	const [dragging, setDragging] = useState<boolean>(false);
	const [error, setError] = useState<Error>({
		fileSizeError: "",
		fileTypeError: "",
	});

	useEffect(() => {
		gsap.fromTo(
			".file_list",
			{
				y: "10px",
				opacity: 0,
			},
			{
				y: "0px",
				opacity: 1,
				duration: 1.5,
				stagger: {
					each: 0.2,
					ease: "power1.in",
				},
			}
		);
	}, [error]);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		handleZoomCard(false);
		if (e.dataTransfer) {
			const { files } = e.dataTransfer;

			if (files && files.length) {
				handleSubmit(files, setFileList, setError);
			}
		}
	};

	const handleZoomCard = (currState: boolean) => {
		setDragging((prevState) => {
			if (!prevState) {
				timeline
					.to(".card", {
						scale: 1.2,
						duration: 1.5,
						ease: "Circ.easeOut",
					})
					.play();
			} else if (prevState) {
				timeline.reverse();
			}

			return currState;
		});
	};

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.target !== drag.current) {
			handleZoomCard(true);
		}
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.target === drag.current) {
			handleZoomCard(false);
		}
	};

	useEffect(() => {
		if (fileInputRef?.current) {
			fileInputRef.current.addEventListener("dragover", handleDragOver);
			fileInputRef.current.addEventListener("drop", handleDrop);
			fileInputRef.current.addEventListener("dragenter", handleDragEnter);
			fileInputRef.current.addEventListener("dragleave", handleDragLeave);
		}

		return () => {
			if (fileInputRef.current) {
				fileInputRef.current.removeEventListener("dragover", handleDragOver);
				fileInputRef.current.removeEventListener("drop", handleDrop);
				fileInputRef.current.removeEventListener("dragenter", handleDragEnter);
				fileInputRef.current.removeEventListener("dragleave", handleDragLeave);
			}
		};
	}, []);

	return (
		<>
			<Particles />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>
			<div className='wrapper'>
				<section className='card'>
					<Video FileList={fileList} />

					<DragDrop
						FileInputRef={fileInputRef}
						Dragging={dragging}
						DragRef={drag}
						Error={error}
					/>

					<ShowFile FileList={fileList} Error={error} />
				</section>
			</div>
		</>
	);
};

export default ReactUpload;
