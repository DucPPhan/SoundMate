import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
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
const OTP_LENGTH = 6;

interface OTPScreenProps {
    navigation?: any;
    email?: string;
    phoneNumber?: string;
    onVerifySuccess?: () => void;
    onResendOTP?: () => void;
    onGoBack?: () => void;
}

export default function OTPScreen({
    navigation,
    email,
    phoneNumber,
    onVerifySuccess,
    onResendOTP,
    onGoBack,
}: OTPScreenProps) {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Refs for OTP inputs
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Animation values
    const buttonScale = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

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

    const shakeError = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];

        // Handle paste
        if (value.length > 1) {
            const pastedOtp = value.slice(0, OTP_LENGTH).split('');
            pastedOtp.forEach((digit, i) => {
                if (i < OTP_LENGTH) {
                    newOtp[i] = digit;
                }
            });
            setOtp(newOtp);
            // Focus last input or the input after pasted content
            const focusIndex = Math.min(pastedOtp.length, OTP_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== OTP_LENGTH) {
            shakeError();
            return;
        }

        setIsLoading(true);
        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false);
            if (onVerifySuccess) {
                onVerifySuccess();
            }
        }, 1500);
    };

    const handleResendOTP = () => {
        if (!canResend) return;

        setCountdown(60);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(''));

        if (onResendOTP) {
            onResendOTP();
        }
    };

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        }
    };

    const maskedContact = email
        ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : phoneNumber
            ? phoneNumber.replace(/(\d{3})(\d*)(\d{3})/, '$1****$3')
            : '***';

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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Ionicons name="arrow-back" size={24} color={SoundMateColors.textPrimary} />
                    </TouchableOpacity>

                    {/* Icon Section */}
                    <View style={styles.iconSection}>
                        <LinearGradient
                            colors={[SoundMateColors.primary, SoundMateColors.primaryDark]}
                            style={styles.iconContainer}
                        >
                            <Ionicons name="shield-checkmark-outline" size={48} color="#FFFFFF" />
                        </LinearGradient>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Xác thực OTP</Text>
                        <Text style={styles.subtitle}>
                            Chúng tôi đã gửi mã xác thực đến{'\n'}
                            <Text style={styles.contactText}>{maskedContact}</Text>
                        </Text>
                    </View>

                    {/* OTP Input Section */}
                    <Animated.View
                        style={[
                            styles.otpContainer,
                            { transform: [{ translateX: shakeAnim }] }
                        ]}
                    >
                        {otp.map((digit, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.otpInputContainer,
                                    digit ? styles.otpInputFilled : null,
                                ]}
                            >
                                <TextInput
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={styles.otpInput}
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    selectTextOnFocus
                                    autoFocus={index === 0}
                                />
                            </View>
                        ))}
                    </Animated.View>

                    {/* Verify Button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={handleVerify}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={[SoundMateColors.primary, SoundMateColors.primaryDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.verifyButton}
                            >
                                {isLoading ? (
                                    <Text style={styles.verifyButtonText}>Đang xác thực...</Text>
                                ) : (
                                    <Text style={styles.verifyButtonText}>Xác thực</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Resend OTP */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Không nhận được mã?</Text>
                        {canResend ? (
                            <TouchableOpacity onPress={handleResendOTP}>
                                <Text style={styles.resendButton}>Gửi lại</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.countdownText}>
                                Gửi lại sau {countdown}s
                            </Text>
                        )}
                    </View>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: SoundMateColors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
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
    titleSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: SoundMateColors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: SoundMateColors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    contactText: {
        color: SoundMateColors.primary,
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    otpInputContainer: {
        width: 50,
        height: 60,
        borderRadius: 16,
        backgroundColor: SoundMateColors.surface,
        borderWidth: 1.5,
        borderColor: SoundMateColors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInputFilled: {
        borderColor: SoundMateColors.primary,
        backgroundColor: SoundMateColors.surfaceLight,
    },
    otpInput: {
        width: '100%',
        height: '100%',
        fontSize: 24,
        fontWeight: '700',
        color: SoundMateColors.textPrimary,
        textAlign: 'center',
    },
    verifyButton: {
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
    verifyButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
        color: SoundMateColors.textSecondary,
        marginBottom: 8,
    },
    resendButton: {
        fontSize: 16,
        fontWeight: '700',
        color: SoundMateColors.primary,
    },
    countdownText: {
        fontSize: 14,
        color: SoundMateColors.textMuted,
    },
});
