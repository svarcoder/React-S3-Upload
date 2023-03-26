import { Folder } from "../shared/image";
import { DragDropProps } from "../shared/type";

const DragDrop = ({
	Error,
	FileInputRef,
	Dragging,
	DragRef,
}: DragDropProps) => {
	return (
		<>
			<h2>Upload your files</h2>
			<p>File should be mp4</p>
			<section
				className={
					Error?.fileTypeError !== "" || Error?.fileSizeError !== ""
						? "error"
						: "drag_and_drop"
				}
				ref={FileInputRef as React.RefObject<HTMLDivElement>}>
				{Error?.fileTypeError ? (
					<p>{Error?.fileTypeError}</p>
				) : Error?.fileSizeError ? (
					<p>{Error?.fileSizeError}</p>
				) : (
					<div className='drag_drop_image'>
						<img
							src={Folder}
							alt='Folder'
							style={{ height: "50px", width: "50px" }}
						/>
						<p>Drag and drop your files here</p>
					</div>
				)}

				{Dragging && (
					<div
						className='dragging'
						ref={DragRef as React.RefObject<HTMLDivElement>}></div>
				)}
			</section>
		</>
	);
};

export default DragDrop;
