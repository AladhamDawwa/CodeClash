import { Typography } from "@mui/material";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const RankFlag = ({transparentColor}:any) => {
  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];

  const user = useSelector((state: RootState) => state.user.data);

  return (<>
    <div style={{
      backgroundColor: '#0f0c29',
      width: '70px',
      height: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'space-between',
      boxShadow: '0 0 3px white',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
      }}>
          <img src={`assets/${ranks[user.rank_tier]}.svg`}
          alt="rank image"
          style={{
            width: '6.5rem',
            height: '6.5rem',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <img src="/assets/Rank.svg" style={{
            width: '4rem',
            height: '4rem',
          }}/>
          <Typography variant="h4" sx={{ color: 'white' }}>
            {user.rank_points}
          </Typography>
        </div>
      </div>

      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        {[...Array(5)].map(() => {
          return <div style={{
            background: `#${transparentColor}`,
            width: 'calc(100% / 5)',
            height: '30px',
            rotate: '45deg',
            margin: '-10px -5px',
            borderRadius: '5px',
            zIndex: 1,
          }}></div>
        })}
      </div>
    </div>
  </>)
};
export default RankFlag