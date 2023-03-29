import { Button } from "primereact/button";
//import React, { useEffect, useState } from "react";
import React, { useState } from "react";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import ServiceAvisos from "src/services/ServiceAvisos";
import "./likeDislike.css";

const ViewsLikeDislike = ({ aviso }) => {
	const [likeAviso, setLikeAviso] = useState(aviso.LIKE_ON);
	const [dislikeAviso, setDislikeAviso] = useState(aviso.LIKE_OF);
	//const [likeActive, setLikeActive] = useState(false);
	//const [dislikeActive, setDislikeActive] = useState(false);

	if (aviso.LIKE_ON == null || aviso.LIKE_ON == undefined) {
		aviso.LIKE_ON = 0;
	}

	if (aviso.LIKE_OF == null || aviso.LIKE_OF == undefined) {
		aviso.LIKE_OF = 0;
	}

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

	const clickLike = (statusLike) => {
		console.log("bbbbbbb");
		if (statusLike === "like") {
			setLikeAviso(likeAviso + 1);
			if (dislikeAviso > 0) setDislikeAviso(-1);
			saveLike();
		} else {
			setDislikeAviso(dislikeAviso + 1);
			if (likeAviso > 0) setLikeAviso(likeAviso - 1);
			saveLike();
		}
	};

	// const functionLikeAvisos = async () => {
	// 	if (likeActive) {
	// 		setLikeActive(false);
	// 		setLikeAviso(likeAviso - 1);
	// 	} else {
	// 		setLikeActive(true);
	// 		setLikeAviso(likeAviso + 1);

	// 		if (dislikeActive) {
	// 			setDislikeActive(false);
	// 			setLikeAviso(likeAviso + 1);
	// 			setDislikeAviso(dislikeAviso - 1);
	// 		}
	// 	}
	// };
	// useEffect(() => {
	// 	saveLike();
	// }, [likeAviso, dislikeAviso]);

	// const functionDislikeAvisos = async () => {
	// 	if (dislikeActive) {
	// 		setDislikeActive(false);
	// 		setDislikeAviso(dislikeAviso - 1);
	// 		saveLike(); // coloquei a função aqui aleatoriamente, depois volta ela pro lugar...
	// 	} else {
	// 		setDislikeActive(true);
	// 		setDislikeAviso(dislikeAviso + 1);

	// 		if (likeActive) {
	// 			setLikeActive(false);
	// 			setDislikeAviso(dislikeAviso + 1);
	// 			setLikeAviso(likeAviso - 1);
	// 		}
	// 	}
	// };

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
					onClick={() => clickLike("like")}
				/>
				<Button
					className="button-dislike-avisos p-1"
					icon={<HiThumbDown className="hi-thumb-Down" />}
					label={dislikeAviso}
					onClick={() => clickLike("disLike")}
				/>
			</div>
		</div>
	);
};

export default ViewsLikeDislike;
