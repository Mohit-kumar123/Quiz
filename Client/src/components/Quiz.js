import React, { useEffect, useState } from 'react';
import Questions from './Questions';

import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';
import { PushAnswer } from '../hooks/setResult';

import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Quiz() {

    const [check, setChecked] = useState(undefined);

    const result = useSelector(state => state.result.result);
    const { queue, trace } = useSelector(state => state.questions);
    const dispatch = useDispatch();

    function enterFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { 
            document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) { 
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { 
            document.documentElement.msRequestFullscreen();
        }
    }

    useEffect(() => {
        const handleBlur = () => {
            alert('Switching tabs is not allowed during the quiz!');
            setTimeout(() => {
                enterFullScreen(); 
            }, 100); 
        };

        const handleContextMenu = (e) => e.preventDefault(); 
        const handleCopy = (e) => e.preventDefault(); 
        const handlePaste = (e) => e.preventDefault(); 

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your quiz will be submitted.';
        };

        const handleFullScreenChange = () => {
            if (!document.fullscreenElement) {
                alert('Please stay in full-screen mode during the quiz!');
                setTimeout(() => {
                    enterFullScreen(); 
                }, 100);  
            }
        };

        enterFullScreen();

        window.addEventListener('blur', handleBlur);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    function onNext() {
        if (trace < queue.length) {
            dispatch(MoveNextQuestion());

            if (result.length <= trace) {
                dispatch(PushAnswer(check));
            }
        }

        setChecked(undefined);
    }

    function onPrev() {
        if (trace > 0) {
            dispatch(MovePrevQuestion());
        }
    }

    function onChecked(check) {
        setChecked(check);
    }

    if (result.length && result.length >= queue.length) {
        return <Navigate to={'/result'} replace={true}></Navigate>;
    }

    return (
        <div className='container'>
            <h1 className='title text-light'>Quiz Application</h1>

            <Questions onChecked={onChecked} />

            <div className='grid'>
                {trace > 0 ? <button className='btn prev' onClick={onPrev}>Prev</button> : <div></div>}
                <button className='btn next' onClick={onNext}>Next</button>
            </div>
        </div>
    );
}
