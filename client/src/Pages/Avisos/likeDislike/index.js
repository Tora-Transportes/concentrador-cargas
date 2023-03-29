import { Button } from "primereact/button";
import React, { useState } from "react";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import useLocalStorage from "src/Pages/Components/useLocalstorage";
import ServiceAvisos from "src/services/ServiceAvisos";
import "./likeDislike.css";

//const ViewsLikeDislike = ({ aviso, likeStorage }) => {
const ViewsLikeDislike = ({ aviso }) => {
	const [likeAviso, setLikeAviso] = useState(
		aviso.LIKE_ON === null ? 0 : aviso.LIKE_ON
	);
	const [dislikeAviso, setDislikeAviso] = useState(
		aviso.LIKE_OF === null ? 0 : aviso.LIKE_OF
	);
	const [likeActive, setLikeActive] = useState(false);
	const [dislikeActive, setDislikeActive] = useState(false);
	const [storage, setStorage] = useLocalStorage("LikeAviso", [
		{
			idAviso: 0,
			like: "",
		},
	]);

	const saveLike = async (like, dislike) => {
		const bodyLike = {
			LIKE_ON: like,
			LIKE_OF: dislike,
		};
		try {
			ServiceAvisos.patchUpdate(aviso.ID, bodyLike);
		} catch (error) {
			console.error(error);
			setTimeout(() => {
				window.aviso.reload();
			}, 3000);
		}
	};

	const saveToCache = (like) => {
		if (like === "on") {
			const idAvisoSelecionado = aviso.ID;
			const infoEnviarStorage = [
				...storage,
				{ idAviso: idAvisoSelecionado, like: "on" },
			];
			const existInfoStorage = storage.some((obj) => {
				return (
					JSON.stringify(obj) ===
					JSON.stringify({ idAviso: idAvisoSelecionado, like })
				);
			});
			if (!existInfoStorage) {
				setStorage(infoEnviarStorage);
				return false;
			} else {
				storage.map((item) => {
					if (item.idAviso === idAvisoSelecionado) {
						item.like = "on";
						return true;
					}
				});
				setStorage(storage);
				return true;
			}
		}
	};

	const clickLike = (statusLike) => {
		if (statusLike === "like" && !likeActive) {
			const idExisteStorage = saveToCache("on");
			if (!idExisteStorage) {
				const like = likeAviso + 1;
				let dislike = 0;
				setLikeAviso(like);
				if (dislikeAviso > 0) {
					dislike = dislikeAviso - 1;
					setDislikeAviso(dislike);
				}
				setLikeActive(true);
				setDislikeActive(false);
				saveLike(like, dislike);
			}
		} else if (statusLike === "disLike" && !dislikeActive) {
			const dislike = dislikeAviso + 1;
			let like = 0;
			setDislikeAviso(dislike);
			if (likeAviso > 0) {
				like = likeAviso - 1;
				setLikeAviso(like);
			}
			setLikeActive(false);
			setDislikeActive(true);
			saveLike(like, dislike);
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
