import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------

export function NotFoundView() {
  const router = useRouter();

  return (
    <Container>
      <Box
        sx={{
          py: 12,
          maxWidth: 480,
          mx: 'auto',
          display: 'flex',
          minHeight: '100vh',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          Sorry, page not found!
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve
          mistyped the URL? Be sure to check your spelling.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration_404.svg"
          sx={{
            mx: 'auto',
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button
          size="large"
          variant="contained"
          component={RouterLink}
          href="/"
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
