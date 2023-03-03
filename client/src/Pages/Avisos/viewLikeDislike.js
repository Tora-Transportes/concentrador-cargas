import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import ServiceAvisos from "src/services/ServiceAvisos";
import "./viewLikeDislike.css";

const ViewsLikeDislike = ({ aviso }) => {
	const [likeAviso, setLikeAviso] = useState(aviso.LIKE_ON);
	const [dislikeAviso, setDislikeAviso] = useState(aviso.LIKE_OF);
	const [likeActive, setLikeActive] = useState(false);
	const [dislikeActive, setDislikeActive] = useState(false);

	if (aviso.LIKE_ON == null || aviso.LIKE_ON == undefined) {
		aviso.LIKE_ON = 0;
	}

	if (aviso.LIKE_OF == null || aviso.LIKE_OF == undefined) {
		aviso.LIKE_OF = 0;
	}

	const functionLikeAvisos = async () => {
		if (likeActive) {
			setLikeActive(false);
			setLikeAviso(likeAviso - 1);
		} else {
			setLikeActive(true);
			setLikeAviso(likeAviso + 1);

			if (dislikeActive) {
				setDislikeActive(false);
				setLikeAviso(likeAviso + 1);
				setDislikeAviso(dislikeAviso - 1);
			}
		}
	};

	const saveLike = async () => {
		const bodyLike = {
			LIKE_ON: likeAviso,
			LIKE_OF: dislikeAviso,
		};
		try {
			await ServiceAvisos.patchUpdate(aviso.ID, bodyLike);
		} catch (error) {
			console.error(error);
			setTimeout(() => {
				window.aviso.reload();
			}, 3000);
		}
	};

	useEffect(() => {
		saveLike();
	}, [likeAviso, dislikeAviso]);

	const functionDislikeAvisos = async () => {
		if (dislikeActive) {
			setDislikeActive(false);
			setDislikeAviso(dislikeAviso - 1);
		} else {
			setDislikeActive(true);
			setDislikeAviso(dislikeAviso + 1);

			if (likeActive) {
				setLikeActive(false);
				setDislikeAviso(dislikeAviso + 1);
				setLikeAviso(likeAviso - 1);
			}
		}
	};

	return (
		<div className="div-reaction-avisos">
			<p className="p-conte-nos-avisos">
				Conte-nos! O que você achou deste aviso?
			</p>
			<div className="buttons-reaction-avisos">
				<Button
					className="button-like-avisos p-1"
					icon={<HiThumbUp className="hi-thumb-Up" />}
					label={likeAviso}
					onClick={() => functionLikeAvisos()}
				/>
				<Button
					className="button-dislike-avisos p-1"
					icon={<HiThumbDown className="hi-thumb-Down" />}
					label={dislikeAviso}
					onClick={() => functionDislikeAvisos()}
				/>
			</div>
		</div>
	);
};

export default ViewsLikeDislike;
