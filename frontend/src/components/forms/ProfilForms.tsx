import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { PostValidation, ProfilValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import axios from "axios";
import { useState } from "react";


const ProfileForms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profileImage } = useUserContext();
  const form = useForm<z.infer<typeof ProfilValidation>>({
    resolver: zodResolver(ProfilValidation),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      //age: calculateAge(user.birthDate).toString(),
      birthDate : user.birthDate ,
      bio: user.bio,
      filiere: user.filiere,
      file: [],
    },
  });

  // Handler
  const handleSubmit = async (value: z.infer<typeof ProfilValidation>) => {

    try {

      const formData = new FormData();
      formData.append("firstname", value.firstname);
      formData.append("lastname", value.lastname);
      //formData.append("age", value.age);
      formData.append("birthDate", value.birthDate);
      formData.append("bio", value.bio);
      formData.append("filiere", value.filiere);
      formData.append("file", value.file[0]);


      // Axios POST request to the API endpoint
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        "http://localhost:8080/users/up",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Authorization header with the JWT token
          },
        }
      );

      console.log(formData);
      console.log(response);
      if (response.data == !"User Updated successfully") {
        toast({
          title: "Please try again",
        });
        //navigate('/');

        // If error occurs, throw the error
        throw error.response.data || error.message;
      }
      // If successful, return success message
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Please try again",
      });
      //navigate('/');

      // If error occurs, throw the error
      throw error.response.data || error.message;
    }
  };

  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                  defaultValue={user.bio}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Profil image</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={profileImage}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Firstname</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  defaultValue={user.firstname}
                  className="shad-input"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Lastname</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="shad-input"
                  defaultValue={user.lastname}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Birth date</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                  defaultValue={user.birthDate}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filiere"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label"></FormLabel>
              <FormControl>
                <select className="shad-input" {...field}>
                  <option value="Undefined">Select Filiere</option>
                  <option value="Informatique">Génie Informatique</option>
                  <option value="Mathématique">Génie Mathématique</option>
                  <option value="Industriel">Génie Industriel</option>
                  <option value="Eléctrique">Génie Eléctrique</option>
                  <option value="Mécanique">Génie Mécanique</option>
                  <option value="Civil">Génie Civil</option>
                </select>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForms;
