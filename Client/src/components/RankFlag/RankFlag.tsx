import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import ranks from '../../utils/ranks';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState } from 'react';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <>
      <CircularProgress
        size={60}
        variant="determinate"
        {...props}
        sx={{
          color: '#FFD700',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          component="div"
          color="white"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </>
  );
}

const RankFlag = () => {
  const user = useSelector((state: RootState) => state.user.data);
  const [hover, setHover] = useState(false);

  // white purple blue green yellow
  const color = '#4B0082';
  return (
    <>
      <div
        style={{
          backgroundColor: color,
          width: '7rem',
          height: '24rem',
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
              gap: '1rem',
              alignItems: 'center',
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                height: '7rem',
                width: '7rem',
              }}
              onMouseEnter={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              {!hover ? (
                <>
                  <StarRoundedIcon
                    style={{
                      color: '#FFD700',
                      width: '7rem',
                      height: '7rem',
                    }}
                  ></StarRoundedIcon>
                  <Typography
                    variant="h4"
                    sx={{
                      position: 'absolute',
                      color: 'black',
                    }}
                  >
                    {user?.user_level.level}
                  </Typography>
                </>
              ) : (
                <CircularProgressWithLabel
                  value={
                    (user?.user_level.xp * 100) /
                    (user?.user_level.xp + user?.user_level.xp_for_next_level)
                  }
                />
              )}
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
                    height: '60px',
                    clipPath:
                      i % 2 == 0
                        ? 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)'
                        : 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)',
                    // rotate: '45deg',
                    margin: '-20px 0',
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
