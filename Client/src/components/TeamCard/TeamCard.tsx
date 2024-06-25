import { Button, Typography } from "@mui/material"

const TeamCard = () => {
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#24243e',
        borderRadius: '1rem',
      }}>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: '500',
          }}
        >
          Team Name
        </Typography>
        {/* Photo */}
        <div style={{
          width: '10rem',
          height: '10rem',
          borderRadius: '50%',
          backgroundColor: 'white',
        }} />
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '500',
            }}
          >
            Leader:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '400',
            }}
          >
            Leader Name
          </Typography>
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '500',
            }}
          >
            Members:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '400',
            }}
          >
            4
          </Typography>
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '500',
            }}
          >
            Games Played:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '400',
            }}
          >
            10
          </Typography>
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '500',
            }}
          >
            Wins:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '400',
            }}
          >
            7
          </Typography>
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
        }}>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '500',
            }}
          >
            Losses:
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: '400',
            }}
          >
            3
          </Typography>
        </div>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: '2rem',
            fontSize: '2rem',
            textTransform: 'capitalize',
            backgroundColor: '#3f51b5',
            color: 'white',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
    
            '&:hover': {
              backgroundColor: '#303f9f',
            },
          }}
          disableRipple
          disableElevation
        >
          View Team
        </Button>
      </div>
    </div>
  )
}
export default TeamCard