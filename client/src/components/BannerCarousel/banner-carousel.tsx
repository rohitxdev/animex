import styles from "./banner-carousel.module.scss";
import ForwardIcon from "@assets/icons/chevron-forward-outline.svg";
import BackIcon from "@assets/icons/chevron-back-outline.svg";
import InfoIcon from "@assets/icons/info.svg";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const BannerCarousel = ({ data }: { data: RecentReleases[] }) => {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const navButtonsRef = useRef<HTMLDivElement | null>(null);
  const [nthButtonColor, setNthButtonColor] = useState(0);

  const scrollTowards = (direction: "left" | "right") => {
    bannerRef.current?.scrollBy({
      left: (direction === "left" ? -1 : 1) * bannerRef.current?.offsetWidth,
    });
    setNthButtonColor((state) => (direction === "left" ? state - 1 : state + 1));
  };

  const scrollRight = (i: number) => {
    bannerRef.current?.scrollBy({
      left: bannerRef.current?.offsetWidth,
    });
    setNthButtonColor(i);
  };

  const autoScroll = (timeout: number) => {
    data.forEach((anime, i) => {
      setTimeout(() => scrollRight(i), i * timeout);
    });

    setNthButtonColor(0);
    setTimeout(() => {
      bannerRef.current?.scrollTo({
        left: 0,
      });
    });
  };

  useEffect(() => {
    const timeout = 5000;
    autoScroll(timeout);
    let intervalTimer: NodeJS.Timer = setInterval(() => autoScroll(timeout), data.length * timeout);
    return () => {
      clearInterval(intervalTimer);
    };
  }, []);
  return (
    <div className={styles.bannerCarousel}>
      <button onClick={() => scrollTowards("left")} className={styles.scrollBtn}>
        <BackIcon />
      </button>
      <button onClick={() => scrollTowards("right")} className={styles.scrollBtn}>
        <ForwardIcon />
      </button>
      <div className={styles.navButtons}>
        {data.map((anime, i) => {
          return (
            <div
              key={anime.episodeId}
              style={i === nthButtonColor ? { backgroundColor: "var(--coral-100)" } : { backgroundColor: "white" }}
            ></div>
          );
        })}
      </div>
      <div className={styles.gallery} ref={bannerRef}>
        {data.map((anime) => {
          const animeIdPieces = anime.episodeId.split("-");
          const animeId = animeIdPieces.slice(0, animeIdPieces.length - 2).join("-");
          const latestEpNum = anime.episodeNum.split("-").at(-1);
          return (
            <div className={styles.banner} id={`${anime.episodeId}-banner`} key={anime.episodeId}>
              <div
                className={styles.bg}
                style={{
                  backgroundImage: ` url(${anime.animeImg})`,
                }}
              ></div>
              <div className={styles.details}>
                <p>{anime.animeTitle}</p>
                <Link to={`/anime-details/${animeId}`}>
                  <p className={styles.latestEp}>Latest episode: {latestEpNum}</p>
                  <p className={styles.subOrDub}>{anime.subOrDub}</p>
                  <button className={styles.moreInfoBtn}>
                    <InfoIcon /> More info
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
