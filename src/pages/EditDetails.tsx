import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDetails } from '@/http/api';
import { useNavigate } from 'react-router-dom';

// Define the form validation schema using Zod
const profileFormSchema = z.object({
    email: z
        .string({
            required_error: 'Please select an email to display.',
        })
        .email(),
    oldPassword: z
        .string({ required_error: 'Old password is required' })
        .min(3, { message: 'Old password is required' }),
    newPassword: z
        .string({ required_error: 'New password is required' })
        .min(3, { message: 'New password is required' }),
});

// Define the type for form values based on the schema
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define the EditDetails component
export function EditDetails() {
    // Initialize the form using useForm with Zod resolver
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        mode: 'onChange',
    });
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            console.log('Book created successfully');
            toast({
                title: 'Profile updated successfully',
            });
            navigate('/dashboard/books');
        },
    });
    // Initialize the toast notification function
    const { toast } = useToast();

    // Define the onSubmit function to handle form submission
    function onSubmit({ email, oldPassword, newPassword }: ProfileFormValues) {
        console.log("email", email);
        console.log("Oldpassword", oldPassword);
        console.log("Newpassword", newPassword);
        mutation.mutate({ email, oldPassword, newPassword })


    }

    return (
        <Form {...form}>
            {/* Render the form with a submit handler */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Render the email field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email here" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Render the old password field */}
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password" // Set the input type to password
                                    placeholder="Enter your old password here"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Render the new password field */}
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password" // Set the input type to password
                                    placeholder="Enter your new password here"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Render the submit button */}
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    );
}
