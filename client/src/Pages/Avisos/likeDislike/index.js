import React, { useReducer, useState, memo } from "react";
import "./likeDislike.css";
import { Button } from "primereact/button";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";

import useLocalStorage from "src/Pages/Components/useLocalstorage";
import ServiceAvisos from "src/services/ServiceAvisos";

const initialLike = {
	likeActive: false,
	deslikeAtive: false,
};

const reducerLike = (state, action) => {
	switch (action.type) {
		case "LIKE":
			return { ...state, likeAtive: true };
		case "DESLIKE":
			return { ...state, deslikeAtive: true };
		default:
			return state;
	}
};

const ViewsLikeDislike = ({ aviso, toast }) => {
	const [likeAviso, setLikeAviso] = useState(
		aviso.LIKE_ON === null ? 0 : aviso.LIKE_ON
	);
	const [dislikeAviso, setDislikeAviso] = useState(
		aviso.LIKE_OF === null ? 0 : aviso.LIKE_OF
	);

	const [tipoLike, dispatchLike] = useReducer(reducerLike, initialLike);
	const [storage, setStorage] = useLocalStorage("like.avisos", [
		{
			idAviso: 0,
			like: "",
		},
	]);
	const idAvisoSelecionado = aviso.ID;

	const messageJaClicado = (message) => {
		toast.current.clear();
		toast.current.show({
			severity: "info",
			summary: "Ops...",
			detail: message,
			life: 3000,
		});
	};

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
		const infoAtualStorage =
			JSON.parse(localStorage.getItem("like.avisos")) || storage;
		const infoSaveCache = [
			...infoAtualStorage,
			{ idAviso: idAvisoSelecionado, like },
		];
		const existeInfoStorage = infoAtualStorage.filter((item) => {
			if (item.idAviso === idAvisoSelecionado) return item;
		});
		if (existeInfoStorage.length) {
			infoAtualStorage.filter((item) => {
				if (item.idAviso === idAvisoSelecionado) {
					item.like = like;
				}
			});
			setStorage(infoAtualStorage);
		} else {
			setStorage(infoSaveCache);
		}
	};

	const existeInfoCache = (like) => {
		const existInfoStorage = storage.some((obj) => {
			return (
				JSON.stringify(obj) ===
				JSON.stringify({ idAviso: idAvisoSelecionado, like })
			);
		});

		return existInfoStorage;
	};

	const clickLike = async (statusLike) => {
		const idExisteCache = await existeInfoCache("on");
		if (statusLike === "like" && !tipoLike.likeActive) {
			if (!idExisteCache) {
				const countLike = likeAviso + 1;
				let countDislike = 0;
				setLikeAviso(countLike);
				if (dislikeAviso > 0) {
					countDislike = dislikeAviso - 1;
					setDislikeAviso(countDislike);
				}
				saveToCache("on");
				dispatchLike({ type: "LIKE" });
				saveLike(countLike, countDislike);
			} else {
				messageJaClicado("Você já deu Like nesse aviso. Obrigado!");
			}
		} else {
			const idExisteCache = await existeInfoCache("off");
			if (
				statusLike === "disLike" &&
				!tipoLike.dislikeActive &&
				!idExisteCache
			) {
				const countDislike = dislikeAviso + 1;
				let countLike = 0;
				setDislikeAviso(countDislike);
				if (likeAviso > 0) {
					countLike = likeAviso - 1;
					setLikeAviso(countLike);
				}
				saveToCache("off");
				dispatchLike({ type: "DESLIKE" });
				saveLike(countLike, countDislike);
			} else {
				messageJaClicado(
					statusLike === "like"
						? "Você já deu Like nesse aviso. Obrigado!"
						: "Você já deu dislike nesse aviso. Obrigado!"
				);
			}
		}
	};

	return (
		<div className="div-reaction-avisos">
			<p className="p-conte-nos-avisos">
				{/* Conte-nos! O que você achou deste aviso? */}
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

export default memo(ViewsLikeDislike);
