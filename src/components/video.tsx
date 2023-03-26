import { Fragment } from "react";
import { VideoProps } from "../shared/type";

const Video = ({ FileList }: VideoProps) => {
	return (
		<>
			<section className='show_video'>
				{FileList &&
					FileList.map((item) => (
						<>
							{item?.url && (
								<Fragment key={item?.url}>
									<video className='video' controls>
										<source src={item?.url} type='video/mp4' />
										Your browser does not support the video tag.
									</video>
								</Fragment>
							)}
						</>
					))}
			</section>
		</>
	);
};

export default Video;
