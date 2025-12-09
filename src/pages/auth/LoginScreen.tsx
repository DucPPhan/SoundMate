import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SoundMateColors } from '../../../constants/theme';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
    navigation?: any;
    onLoginSuccess?: () => void;
    onNavigateToRegister?: () => void;
}

export default function LoginScreen({ navigation, onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animation values
    const buttonScale = useRef(new Animated.Value(1)).current;
    const logoScale = useRef(new Animated.Value(1)).current;

    // Logo pulse animation
    React.useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleLogin = async () => {
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        }, 1500);
    };

    const handleForgotPassword = () => {
        console.log('Forgot password pressed');
    };

    const handleCreateAccount = () => {
        if (onNavigateToRegister) {
            onNavigateToRegister();
        }
    };

    return (
        <View style={styles.container}>
            {/* Background with gradient overlay */}
            <LinearGradient
                colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
                style={styles.backgroundGradient}
            />

            {/* Decorative circles */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo/Avatar Section */}
                    <View style={styles.logoSection}>
                        <Animated.View
                            style={[
                                styles.logoContainer,
                                { transform: [{ scale: logoScale }] }
                            ]}
                        >
                            <LinearGradient
                                colors={[SoundMateColors.primary, SoundMateColors.primaryDark]}
                                style={styles.logoGradient}
                            >
                                <Ionicons name="musical-notes" size={48} color="#FFFFFF" />
                            </LinearGradient>
                            {/* Glow effect */}
                            <View style={styles.logoGlow} />
                        </Animated.View>
                        <Text style={styles.appName}>SoundMate</Text>
                        <Text style={styles.appTagline}>Kết nối âm nhạc</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Đăng nhập</Text>

                        {/* Email Input */}
                        <View style={[
                            styles.inputContainer,
                            isEmailFocused && styles.inputContainerFocused
                        ]}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={isEmailFocused ? SoundMateColors.primary : SoundMateColors.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={SoundMateColors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onFocus={() => setIsEmailFocused(true)}
                                onBlur={() => setIsEmailFocused(false)}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={[
                            styles.inputContainer,
                            isPasswordFocused && styles.inputContainerFocused
                        ]}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={isPasswordFocused ? SoundMateColors.primary : SoundMateColors.textMuted}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Mật khẩu"
                                placeholderTextColor={SoundMateColors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={SoundMateColors.textMuted}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleLogin}
                                disabled={isLoading}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={[SoundMateColors.primary, SoundMateColors.primaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.loginButton}
                                >
                                    {isLoading ? (
                                        <View style={styles.loadingContainer}>
                                            <Text style={styles.loginButtonText}>Đang đăng nhập...</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPasswordContainer}
                        >
                            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Create Account Button */}
                    <TouchableOpacity
                        onPress={handleCreateAccount}
                        style={styles.createAccountButton}
                    >
                        <Text style={styles.createAccountText}>Tạo tài khoản mới</Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <Text style={styles.footerText}>
                        Bằng việc đăng nhập, bạn đồng ý với{' '}
                        <Text style={styles.linkText}>Điều khoản dịch vụ</Text>
                        {' '}và{' '}
                        <Text style={styles.linkText}>Chính sách bảo mật</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SoundMateColors.background,
    },
    backgroundGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: SoundMateColors.primary,
        opacity: 0.1,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -150,
        left: -100,
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: SoundMateColors.accent,
        opacity: 0.08,
    },
    decorativeCircle3: {
        position: 'absolute',
        top: height * 0.4,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: SoundMateColors.primaryLight,
        opacity: 0.05,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    logoGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: SoundMateColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
    logoGlow: {
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: 60,
        backgroundColor: SoundMateColors.primary,
        opacity: 0.15,
        zIndex: -1,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: SoundMateColors.textPrimary,
        letterSpacing: 2,
    },
    appTagline: {
        fontSize: 14,
        color: SoundMateColors.textSecondary,
        marginTop: 4,
        letterSpacing: 1,
    },
    formContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: SoundMateColors.textPrimary,
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: SoundMateColors.surface,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: SoundMateColors.border,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 58,
    },
    inputContainerFocused: {
        borderColor: SoundMateColors.primary,
        backgroundColor: SoundMateColors.surfaceLight,
        shadowColor: SoundMateColors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: SoundMateColors.textPrimary,
    },
    eyeIcon: {
        padding: 4,
    },
    loginButton: {
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: SoundMateColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: SoundMateColors.primary,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 28,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: SoundMateColors.border,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
        color: SoundMateColors.textMuted,
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 28,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: SoundMateColors.surface,
        borderWidth: 1.5,
        borderColor: SoundMateColors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountButton: {
        height: 58,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: SoundMateColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        backgroundColor: 'transparent',
    },
    createAccountText: {
        fontSize: 16,
        fontWeight: '700',
        color: SoundMateColors.primary,
        letterSpacing: 0.5,
    },
    footerText: {
        fontSize: 12,
        color: SoundMateColors.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
    linkText: {
        color: SoundMateColors.primary,
        fontWeight: '600',
    },
});
