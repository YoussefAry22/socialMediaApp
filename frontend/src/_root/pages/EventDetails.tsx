import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Event {
  eventId: number;
  userId: number;
  firstname: string;
  lastname: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  creationDate: string;
  location: string;
  organizer: string;
  image: string;
  imageData: string;
  imageProfilData: string;
}

const arrayBufferToBase64 = (buffer: any) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const EventDetails = () => {
  const { user } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Event | undefined>();
  const [imageURL, setImageURL] = useState<string>("");

  const location = useLocation();
  const eventsState = location.state as { events: any[] } | undefined;
  const { events } = eventsState || { events: [] };


  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (events) {
      const selectedEvent = events.find((e) => e.id === parseInt(id));
      setEvent(selectedEvent);
      console.log("neeeeew")
      console.log(selectedEvent);
    }
  }, [id, events]);

  useEffect(() => {
    const fetchData = async (id: any) => {
      setIsLoading(true);
      try {
        const eventResponse = await axios.get<Event>(
          `http://localhost:8080/users/events/${id}`
        );
        const base64Image = arrayBufferToBase64(eventResponse.data.imageData);
        const image = `data:image/jpeg;base64,${base64Image}`;

        setEvent(eventResponse.data);
        console.log("666666");

        console.log(eventResponse.data);

        const imageResponse = await axios.get(`http://localhost:8080/users/events/img/12`, {
          responseType: 'arraybuffer'
        });
        const base64Imagee = arrayBufferToBase64(imageResponse.data);
        const imagee = `data:image/jpeg;base64,${base64Imagee}`;

        //console.log(imagee);

        setImageURL(imagee);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(id);
  }, [id]);

  const handleDelete = async (eventId: number | undefined) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!eventId || !token) return;

      const response = await axios.delete(
        `http://localhost:8080/users/events/del/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Event deleted ✔ ",
      });
      navigate("/events");
      console.log("Event deleted successfully:", response.data);
    } catch (error) {
      toast({
        title: "Failed to delete event",
      });
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="post_details-container">
      <h3 className="body-bold md:h3-bold w-full my-10">EVENT DETAILS</h3>

      <div className="post_details-card">
        <img src={event?.imageData} alt="event" className="post_details-img" />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to="/profile" className="flex items-center gap-3">
              <img
                src={
                  event?.imageProfilData ||
                  "/assets/icons/profile-placeholder.svg"
                }
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
              />
              <div className="flex gap-1 flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {event?.firstname} {event?.lastname}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular ">
                    {multiFormatDateString(event?.creationDate)}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4 ">
              <Button
                onClick={() => handleDelete(event?.eventId)}
                className={`${parseInt(user.id, 10) === event?.userId ? "" : "hidden"
                  }`}>
                <img
                  src={"/assets/icons/delete.svg"}
                  alt="delete"
                  width={24}
                  height={24}
                />
              </Button>
              <Link
                to={`/update-post/${event?.eventId}`}
                className={`${parseInt(user.id, 10) === event?.userId ? "" : "hidden"
                  }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          <hr className="border w-full border-dark-4/80" />
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <h1><b> {event?.eventName} </b> </h1>
          </div>
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <p><b><i>Date : </i></b> {event?.eventDate}</p>
          </div>
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <p><b><i>Location : </i></b> {event?.location}</p>
          </div>
          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p><b><i>Description : </i></b>{event?.eventDescription}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
      </div>
    </div>
  );
};

export default EventDetails;
