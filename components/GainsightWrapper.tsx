'use client'
import Script from 'next/script'
import { type ReactNode } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

type GainsightProps = {
    isHelmet: boolean
    children: ReactNode
    scriptContent: string
}

const helmetContext = {}

export function GainsightWrapper(props: GainsightProps) {
    return props.isHelmet ? (
    <HelmetProvider context={helmetContext}>
        <Helmet>
            <script>
            {`var myData = { "myPageType":"foo" }; 
            console.log("Script loaded using helmet:", myData);
            ${props.scriptContent}; 
            const counter = Number(localStorage.getItem('counter')); 
            localStorage.setItem('counter', counter+1); 
            console.log('Current counter',localStorage.getItem('counter'))`}
            </script>
        </Helmet>
        {props.children}
    </HelmetProvider>
    ) : (
    <>
        <Script id="analytics-script" strategy='afterInteractive'
            onLoad={() => {
                console.log('Script has loaded')
            }}
        >
            {`var myData = { "myPageType":"foo" }; 
            console.log("Script loaded using NextJS Script tag:", myData);
            ${props.scriptContent}; 
            const counter1 = Number(localStorage.getItem('counter')); 
            localStorage.setItem('counter', counter1+1); 
            console.log('Current counter',localStorage.getItem('counter'))`}
        </Script>
        {props.children}
    </>
    )
}