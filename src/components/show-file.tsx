import { Done, File } from "../shared/image";
import { ShowFileProps } from "../shared/type";

const ShowFile = ({ FileList, Error }: ShowFileProps) => {
	return (
		<>
			<section className='footer'>
				{Error?.fileTypeError === "" &&
					Error?.fileSizeError === "" &&
					FileList.map((file) => (
						<div className='file_list' key={file?.name}>
							<>
								<img src={File} alt='' />
							</>
							<div className='info'>
								<div className='file_name'>
									<span>{`${
										file?.name.length > 16
											? file?.name.substring(0, 16)
											: file?.name
									}${file?.name.length > 16 ? "...." : ""}`}</span>
									<span>{file?.progress}%</span>
								</div>
								<div className='progress-bar'>
									<div
										className='progress-fill'
										style={{ width: `${file?.progress}%` }}></div>
								</div>
							</div>

							<div className='done_parent'>
								{file?.url && <img src={Done} alt='' className='done' />}
							</div>
						</div>
					))}
			</section>
		</>
	);
};

export default ShowFile;
