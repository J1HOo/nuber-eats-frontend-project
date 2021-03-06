import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { coockedOrders } from "../../__generated__/coockedOrders";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
    lat: number;
    lng: number;
  }

  interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
  }
  const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;
  
  
export const Dashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
    const [map, setMap] = useState<google.maps.Map>();
    const [maps, setMaps] = useState<any>();

    // @ts-ignore
    const onSucces = ({ coords: { latitude, longitude } }: Position) => {
      setDriverCoords({ lat: latitude, lng: longitude });
    };
    // @ts-ignore
    const onError = (error: PositionError) => {
      console.log(error);
    };
    useEffect(() => {
      navigator.geolocation.watchPosition(onSucces, onError, {
        enableHighAccuracy: true,
      });
    }, []);
    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        }
      }, [driverCoords.lat, driverCoords.lng]);
    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      setMap(map);
      setMaps(maps);
    };
    const makeRoute = () => {
        if (map) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
              strokeColor: "#000",
              strokeOpacity: 1,
              strokeWeight: 5,
            },
          });
          directionsRenderer.setMap(map);
          directionsService.route(
            {
              origin: {
                location: new google.maps.LatLng(
                  driverCoords.lat,
                  driverCoords.lng
                ),
              },
              destination: {
                location: new google.maps.LatLng(
                  driverCoords.lat + 0.05,
                  driverCoords.lng + 0.05
                ),
              },
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result) => {
              directionsRenderer.setDirections(result);
            }
          );
        }
      };
      const { data: coockedOrdersData } = useSubscription<coockedOrders>(
        COOCKED_ORDERS_SUBSCRIPTION
      );
      useEffect(() => {
        if (coockedOrdersData?.cookedOrders.id) {
          makeRoute();
        }
      }, [coockedOrdersData]);
      const history = useHistory();
      const onCompleted = (data: takeOrder) => {
        if (data.takeOrder.ok) {
          history.push(`/orders/${coockedOrdersData?.cookedOrders.id}`);
        }
      };
      const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
        TAKE_ORDER_MUTATION,
        {
          onCompleted,
        }
      );
      const triggerMutation = (orderId: number) => {
        takeOrderMutation({
          variables: {
            input: {
              id: orderId,
            },
          },
        });
      };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          draggable={true}
          defaultCenter={{
            lat: 37.55164143858216,
            lng: 126.95201289994903,
          }}
          bootstrapURLKeys={{ key: "AIzaSyAvOR6cFL4NEFQqWlf-li_Rmt__DJc0Wm8" }}
          ></GoogleMapReact>
      </div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              배달요청이 들어왔습니다..
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
               @{" "}{coockedOrdersData?.cookedOrders.restaurant?.name}에서 음식을 받아주세요.
            </h1>
            <button
              onClick={() =>
                triggerMutation(coockedOrdersData?.cookedOrders.id)
              }
              className="btn w-full  block  text-center mt-5"
            >
              배달하겠습니다. &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            준비된 배달이 없습니다.
          </h1>
        )}
      </div>
    </div>
  );
};