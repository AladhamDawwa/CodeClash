import { Typography } from '@mui/material';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

const RankFlag = () => {
  const ranks = ['bronze', 'silver', 'gold', 'diamond', 'master'];

  const user = useSelector((state: RootState) => state.user.data);

  // white purple blue green yellow
  const color = '#4B0082';
  return (
    <>
      <div
        style={{
          backgroundColor: color,
          width: '60px',
          height: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
            }}
          >
            <img
              src={`assets/${ranks[user?.rank_tier]}.svg`}
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
              <img
                src="/assets/Rank.svg"
                style={{
                  width: '4rem',
                  height: '4rem',
                }}
              />
              <Typography variant="h4" sx={{ color: 'white' }}>
                {user?.rank_points}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {[...Array(6)].map((_, i) => {
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: color,
                    width: 'calc(100% / 6)',
                    height: '35px',
                    clipPath:
                      i % 2 == 0
                        ? 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)'
                        : 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
                    // rotate: '45deg',
                    // margin: '-5px -10px',
                    // borderRadius: '5px',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default RankFlag;
