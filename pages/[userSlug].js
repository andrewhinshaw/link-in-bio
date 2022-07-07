import React, { Fragment, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import _ from "lodash";

import { Dialog, Transition } from "@headlessui/react";
import LinkButton from "../components/LinkButton";
import LinkButtonEmptyState from "../components/LinkButtonEmptyState";
import InlineEdit from "../components/profile/InlineEdit";
import LoadingSpinner from "../components/LoadingSpinner";

import prisma from "../lib/prisma";

const LinkPage = ({ userPageData }) => {
  const router = useRouter();
  const { userSlug } = router.query;

  // Store the initial profile data and initialize the current data
  const initialData = useRef({
    displayName: userPageData.displayName,
    occupation: userPageData.occupation,
    location: userPageData.location,
    description: userPageData.description,
  });
  const [currentData, setCurrentData] = useState({
    displayName: userPageData.displayName,
    occupation: userPageData.occupation,
    location: userPageData.location,
    description: userPageData.description,
  });

  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isPageEditingModeEnabled, setIsEditingModeEnabled] = useState(false);
  const [isDiscardChangesModalOpen, setIsDiscardChangesModalOpen] = useState(false);
  const [resetChanges, setResetChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Takes in edited data from InlineEdit component 
  // and updates state accordingly
  const handleSetEditedValue = (editedValue) => {
    const newData = _.merge(currentData, editedValue);

    // Check if the newly edited data differs from the initial profile data
    if (!_.isEqual(initialData.current, newData)) {
      setIsDataChanged(true);
    } else {
      setIsDataChanged(false);
    }

    // Update the current data with the newly edited profile data
    setCurrentData({
      ...currentData
    });
  };

  // Discards the edited data and resets to the initial data
  const handleDiscardChanges = () => {
    setResetChanges(true);
    setCurrentData({
      displayName: initialData.current.displayName,
      occupation: initialData.current.occupation,
      location: initialData.current.location,
      description: initialData.current.description,
    });
    setIsEditingModeEnabled(false);
    setIsDataChanged(false);
    handleCloseDiscardChangesModal();
  }

  // Enables/disables editing mode
  const handleToggleEditing = () => {
    if (isPageEditingModeEnabled) {
      if (!_.isEqual(initialData.current, currentData)) {
        // We're in editing mode AND there are data changes detected 
        // Show the user a modal to confirm discarding changes
        handleOpenDiscardChangesModal();
      } else {
        // We're in editing mode but there are no data changes detected 
        // Disable editing mode
        setIsEditingModeEnabled(false);
      }
    } else {
      // We're not currently in editing mode
      // Enable editing mode
      setIsEditingModeEnabled(true);
    }
  };

  // Open the discard changes modal
  const handleCloseDiscardChangesModal = () => {
    setIsDiscardChangesModalOpen(false);
  };

  // Close the discard changes modal
  const handleOpenDiscardChangesModal = () => {
    setIsDiscardChangesModalOpen(true);
  };

  // Save the changes that were made to the database
  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Find only values which have changed from initial
    let changes = {};
    for (let key of Object.keys(initialData.current)) {
      if (initialData.current[key] !== currentData[key]) {
        changes[key] = currentData[key];
      }
    }

    // Send POST request to server to update user page
    const result = await fetch("/api/pages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(changes)
    });
    const resultJson = await result.json();
    const page = resultJson?.page;

    if (!page) {
      console.error("Unable to save page data", result);
      setIsSaving(false);
      return;
    }

    // Update the initial data with the newly saved profile data
    initialData.current = {
      displayName: page.displayName,
      occupation: page.occupation,
      location: page.location,
      description: page.description,
    };

    // Update the current data with the newly saved profile data
    setCurrentData({
      displayName: page.displayName,
      occupation: page.occupation,
      location: page.location,
      description: page.description,
    });

    handleToggleEditing();
    setIsSaving(false);
  }

  // Show 404 if the requested page does not exist
  if (!userPageData) {
    return <div>This page does not exist</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start mt-48">

      {/* Discard changes modal */}
      <Transition appear show={isDiscardChangesModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseDiscardChangesModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-md transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-center leading-6 text-gray-900"
                  >
                    Discard changes
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      Are you sure you want to discard your changes?
                    </p>
                  </div>

                  <div className="mt-4 flex flex-row justify-center space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDiscardChanges}
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={handleCloseDiscardChangesModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit and save buttons */}
      <div className="absolute top-4 right-4 flex flex-row justify-center items-center">
        {/* If we're in editing mode and the data has changed, show the save changes button */}
        {isPageEditingModeEnabled && isDataChanged ? (
          <a onClick={handleSaveChanges} className="mr-2 rounded-full bg-blue-500 text-white font-medium text-sm py-1 px-3 cursor-pointer hover:bg-blue-600">
            <div className="flex flex-row items-center">
              {isSaving && <LoadingSpinner height={12} width={12} color="#fff" className="mr-2" />}
              {isSaving ? "Saving..." : "Save"}
            </div>
          </a>
        ) : null}
        <a
          onClick={handleToggleEditing}
          className="rounded-full p-2 cursor-pointer hover:bg-gray-100 text-gray-500"
        >
          {isPageEditingModeEnabled ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          )}
        </a>
      </div>

      {/* User link page card */}
      <div className="max-w-lg w-full bg-white rounded-lg border border-gray-200 shadow-md p-8">
        <div className="flex flex-col items-center">
          <img
            className="absolute -translate-y-24 mb-3 w-32 h-32 rounded-full shadow-lg"
            src={userPageData.user.image}
            alt="Bonnie image"
          />
          <InlineEdit
            identifier="displayName"
            value={currentData.displayName}
            setValue={handleSetEditedValue}
            isEditing={isPageEditingModeEnabled}
            reset={resetChanges}
            setReset={setResetChanges}
            className="mt-12 text-xl font-medium text-gray-900 text-center"
          />
          <InlineEdit
            identifier="occupation"
            value={currentData.occupation}
            setValue={handleSetEditedValue}
            isEditing={isPageEditingModeEnabled}
            reset={resetChanges}
            setReset={setResetChanges}
            className="text-base text-gray-700 mb-2 text-center"
          />
          <InlineEdit
            identifier="location"
            value={currentData.location}
            setValue={handleSetEditedValue}
            isEditing={isPageEditingModeEnabled}
            reset={resetChanges}
            setReset={setResetChanges}
            className="text-sm text-gray-400 mb-2 text-center"
          />
          <InlineEdit
            identifier="description"
            value={currentData.description}
            setValue={handleSetEditedValue}
            isEditing={isPageEditingModeEnabled}
            reset={resetChanges}
            setReset={setResetChanges}
            className="text-sm text-gray-700 mb-2 text-center"
          />
          {userPageData.links.map((link, index) => (
            <LinkButton key={index} url={link.url} displayText={link.displayText} linkId={link.id} isPageEditingModeEnabled={isPageEditingModeEnabled} />
          ))}
          {isPageEditingModeEnabled && userPageData.links.length <= 10 ? <LinkButtonEmptyState /> : null}
        </div>
      </div>
    </div>
  );
};

const getServerSideProps = async ({ req, res, params }) => {
  const slug = params.userSlug;

  // Get the link page for this page's username
  let userPageData = null;
  try {
    userPageData = await prisma.page.findUnique({
      where: { slug: slug },
      include: {
        user: true,
        links: true
      },
    });

    // Used to convert datetime fields to strings before returning
    userPageData = JSON.parse(JSON.stringify(userPageData));
  } catch (err) {
    console.error(err);
  }

  return {
    props: { userPageData },
  };
};

export default LinkPage;
export { getServerSideProps };
