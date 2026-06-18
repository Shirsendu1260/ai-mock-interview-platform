import { COLORS } from "./constants/design.js";
import useAuthInitialization from "./hooks/useAuthInitialization.js";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

const App = () => {
    useAuthInitialization();

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={true}
                toastOptions={{
                    duration: 4635,
                    style: {
                        background: COLORS.background,
                        color: COLORS.dark,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '16px'
                    },
                    success: {
                        iconTheme: {
                            primary: COLORS.accent,
                            secondary: COLORS.background
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: COLORS.background
                        }
                    }
                }}
            />

            <AppRoutes />
        </>
    );
}

export default App
